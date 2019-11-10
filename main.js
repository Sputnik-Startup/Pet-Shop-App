
const {app, BrowserWindow, Tray} = require('electron')
const path = require('path')

let mainWindow

function createWindow () {
  const appIcon = new Tray(path.join(__dirname, 'src', 'assets', 'logo.ico'))
  mainWindow = new BrowserWindow({
    show: false,
    width: 1000,
    height: 600,
    minHeight: 400,
    minWidth: 800,
    autoHideMenuBar: false,
    icon: path.join(__dirname, 'src', 'assets', 'logo.ico'),
    webPreferences: {
      devTools: true,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('./src/pages/loginPage/index.html')

  //mainWindow.webContents.openDevTools()


  mainWindow.maximize()
  mainWindow.show()
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
