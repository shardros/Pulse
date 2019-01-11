const { app, BrowserWindow } = require('electron')
const BR = require('./scripts/boardRouter')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window but don't show it yet
  win = new BrowserWindow({ show: false })
  win.maximize();
  
  // and load the index.html of the app.
  win.loadFile('index.html')

  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}


app.on('ready', createWindow)

win.once('ready-to-show', () => {
  win.show()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {})

app.on('activate', () => {})


