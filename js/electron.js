/**
 * Server side electron
 */


"use strict";

const server = require(__dirname + "/server.js");
const electron = require("electron");
const core = require(__dirname + "/app.js");



// Config
var config = {};
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

var loadedModules = [];

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

function createWindow() {

	console.log("creating window");
	// Create the browser window.
	if (config.kioskmode) {
		mainWindow = new BrowserWindow({width: 800, height: 600, x: 0, y: 0, kiosk:true, darkTheme: true, webPreferences: {nodeIntegration: false}});
	} else {
		mainWindow = new BrowserWindow({width: 800, height: 600, x: 0, y: 0, fullscreen: true, autoHideMenuBar: true, darkTheme: true, webPreferences: {nodeIntegration: false}});
	}

	// and load the index.html of the app.
	//mainWindow.loadURL('file://' + __dirname + '../../index.html');
	mainWindow.loadURL("http://localhost:" + config.port);

	// Open the DevTools if run with "npm start dev"
	if(process.argv[2] == "dev") {
		mainWindow.webContents.openDevTools();
	}

	// Set responders for window events.
	mainWindow.on("closed", function() {
		mainWindow = null;
	});

	if (config.kioskmode) {
		mainWindow.on("blur", function() {
			mainWindow.focus();
		});

		mainWindow.on("leave-full-screen", function() {
			mainWindow.setFullScreen(true);
		});

		mainWindow.on("resize", function() {
			setTimeout(function() {
				mainWindow.reload();
			}, 1000);
		});
	}

	var child;
	var childIsOpen = false;

	mainWindow.webContents.on('new-window', function (event, url) {

		event.preventDefault();


		/** Kinda hacky */


		if(url === "http://localhost:8080/close"){

			if(childIsOpen){
				child.close();
				childIsOpen = false;
			}

		}
		else{

			if(child != null){
				try{
					child.close();
				}
				catch(err){

				}
			}
			//console.log("Url: "+url);



			var width = url.slice(url.indexOf('***'), (url.indexOf('****')+4));
			url = url.replace(width, '***');
			width = width.substring(3, (width.length-4));
			var height = url.slice(url.indexOf('***'), url.indexOf('****')+4);
			url = url.replace(height, '');
			height = height.substring(3, (height.length-4));

			var w_section = (width/4);
			var h_section = (height/8);
			var windowW = width-(w_section);
			var windowH = height-(h_section);

			//console.log("width: "+windowW);
			//console.log("height: "+windowH);
			//console.log("Url: "+url);

				child = new BrowserWindow(
				{
					width: windowW,
					height: windowH,
					//useContentSize: true,
					parent: mainWindow,
					//modal: true,
					//show: false,
					autoHideMenuBar: true,
					frame:false,
					//'skip-taskbar': true,
					'alwaysOnTop' : true
				});


			//console.log("childW: "+server.screenWidth);
			child.loadURL(url);
			child.show();
			childIsOpen = true;

		}

	});

}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.

/*
app.on("ready", function() {
	console.log("Launching application.");
	createWindow();
});*/

// Quit when all windows are closed.
app.on("window-all-closed", function() {
	createWindow();
});

app.on("activate", function() {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});




// Start the core application.
// This starts all node helpers and starts the webserver.
core.start(
	function (c) {
		config = c;
		console.log("ELECTRON CONFIG: ");
		console.log(config.modules);
		loadedModules = config.modules;		//This variable is from app.js

		createWindow()
	});
