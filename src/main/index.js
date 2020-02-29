import { app, BrowserWindow, Menu, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		height: 640,
		useContentSize: true,
		width: 1000,
		frame: true,
		webPreferences: {
		nodeIntegration: true
		}
	})

  	mainWindow.loadURL(winURL)

  	function getEventListener(name){
    	return () => mainWindow.webContents.send('menu:update', {type: name})
  	}

  	let devTools = false;
	const appMenu = Menu.buildFromTemplate([
		{
		label: 'File',
		submenu: [
			{
			label: 'Open File...',
			click: getEventListener('file:open')
			},
			{ type: 'separator' },
			{
			label: 'Save',
			click: getEventListener('file:save')
			},
			{
			label: 'Save as...',
			click: getEventListener('file:save_as')
			},
			{
			label: 'Settings',
			click: getEventListener('settings')
			},
			{ type: 'separator' },
			{
			label: 'Exit'
			}
		]
		},
		{
		label: 'Edit',
		submenu: [
			{
			label: 'Add node...',
			click: getEventListener('edit:node:add')
			},
			{
			label: 'Manage dictionnaries...',
			click: getEventListener('edit:dictionnaries')
			}, 
			{
			label: 'Manage buildpacks...',
			click: getEventListener('edit:buildpacks')
			},
			{ type: 'separator' },
			{
			label: 'Clear billboard',
			click: getEventListener('edit:clear')
			},
			{
			label: 'Recenter billboard',
			click: getEventListener('edit:recenter')
			}, {
			label: 'Fix Links position',
			click: getEventListener('edit:fix_links')
			}
		]
		},
		{
			label: 'Build',
			submenu: [
				{
					label: 'Mode',
					submenu: [
						{
							label: 'Build',
							type: 'radio',
							click: getEventListener('build:mode:build'),
							checked: true
						},
						{
							label: 'Run',
							type: 'radio',
							click: getEventListener('build:mode:run')
						}
					]  
					},
				{
					label: 'Run',
					click: getEventListener('build:run')
				},
				{
					label:'Run with...',
					click: getEventListener('build:run_with')
				},
				{ type: 'separator' },
				{
					label: 'Compile with...',
					click: getEventListener('build:compile')
				}
			]
		},
		{
		label: 'View',
		submenu: [
			{
				label: 'Show script bounds',
				click: getEventListener('view:bounds')
			},
			{ type: 'separator' },
			{
				label: 'Toggle Dev Tools',
				accelerator: 'CmdOrCtrl+Shift+I',
				click() {
					if(devTools){
						mainWindow.webContents.closeDevTools();
						devTools = false;
					} else {
						mainWindow.webContents.openDevTools();
						devTools = true;
					}
				}
			},
			{
				label: 'Reload',
				accelerator: 'CmdOrCtrl+R',
				click() {
					mainWindow.loadURL(winURL);
				}
			}
		]
	}]);

	Menu.setApplicationMenu(appMenu);

  	mainWindow.on('closed', () => {
    	mainWindow = null
  	})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
