import cv2
from camera.base_camera import BaseCamera
import numpy as np
from network import c3d_model
import torch
import time
torch.backends.cudnn.benchmark = True

device = torch.device("cuda:0" if torch.cuda.is_available() else 'cpu')

model1 = c3d_model.C3D(num_classes=11)
model2 = c3d_model.C3D(num_classes=11)

checkpoint = torch.load('./model/C3D_ucf101_epoch-24.pth.tar',
                        map_location=lambda storage, loc: storage)

model1.load_state_dict(checkpoint['state_dict'])
model1.to(device)
model1.eval()

checkpoint = torch.load('./model/C3D_own_epoch-59.pth',
                        map_location=lambda storage, loc: storage)

model2.load_state_dict(checkpoint)
model2.to(device)
model2.eval()

with open('./result.txt') as f:
    class_names = f.readlines()
    f.close()

def center_crop(frame):
    frame = frame[8:120, 30:142, :]
    return np.array(frame).astype(np.float32)

class Camera(BaseCamera):
    video_source = 0

    @staticmethod
    def set_video_source(source):
        Camera.video_source = source

    @staticmethod
    def frames():
        camera = cv2.VideoCapture(Camera.video_source)
        if not camera.isOpened():
            raise RuntimeError('Could not start camera.')
        clip = []
        start = time.time()
        while True:
            _, img = camera.read()
            tmp = center_crop(cv2.resize(img, (171, 128)))
            tmp -= np.array([[[90.0, 98.0, 102.0]]])
            clip.append(tmp)

            if len(clip) == 16:
                inputs = np.array(clip).astype(np.float32)
                inputs = np.expand_dims(inputs, axis=0)
                inputs = np.transpose(inputs, (0, 4, 1, 2, 3))
                inputs = torch.from_numpy(inputs).to(device)
                with torch.no_grad():
                    if np.random.random() > 0.5:
                        outputs = model1.forward(inputs)
                    else:
                        outputs = model2.forward(inputs)
                probs = torch.nn.Softmax(dim=1)(outputs)
                label = torch.max(probs, 1)[1].detach().cpu().numpy()[0]

                current = time.time()
                if (current - start) > 3:
                    with open('./result.txt', 'w') as f:
                        f.writelines(str(class_names[label].split(' ')[-1].strip()))
                        f.close()

                for i in range(8):
                    clip.pop(0)

            _, img = camera.read()
            show = cv2.resize(img, (768, 576))
            yield cv2.imencode('.jpg', show)[1].tobytes()



