// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1200, height: 900})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.---调试用的
 //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  }) 
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const ipc = require('electron').ipcMain;

ipc.on('button-click',()=> {
    mainWindow.loadFile('ready.html');
});

ipc.on('run',(event, arg)=> {
    var child_process = require('child_process');

    var path = '.';
    var ls = child_process.spawn('python', ['/home/tkcki/桌面/test_demo/pytorch_test/inference.py']);
    ls.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
      event.sender.send('run-result',data)
    });
    // require('child_process').exec('python test_interface.py', (err, stdout, stderr) => {
    //     if (err) {
    //         console.log('stderr:', err);
    //     }
            
    //     if (stdout) {
    //         console.log('stdout-js:', stdout);
    //         event.sender.send('run-result',stdout)
    //     }
    // });
});

ipc.on('timeout',()=> {
    mainWindow.loadFile('video.html')
});