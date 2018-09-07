#!/usr/bin/env python
from flask import Flask, render_template, Response
from camera.camera_opencv import Camera

app = Flask(__name__)

@app.route('/')
def index():
    with open('./result.txt', 'w') as f:
        f.writelines('......')
        f.close()
    return render_template('index.html')

@app.route('/ready')
def ready():
    with open('./result.txt', 'w') as f:
        f.writelines('......')
        f.close()
    return render_template('ready.html')

@app.route('/videoLabel/<label>/')
def videoLabel(label):
    context ={
        "label": label
    }
    return render_template("video.html",**context)

@app.route('/video')
def video():
    return render_template("video.html")

@app.route('/label')
def label():
    while True:
        with open('./result.txt', 'r') as f:
            label = str(f.readlines()[0])
            f.close()
        return (str(label))

@app.route('/success')
def success():
    return  render_template('success.html')

@app.route('/fail')
def fail():
    return render_template('fail.html')

def gen(camera):
    """Video streaming generator function."""
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True, debug=True)
