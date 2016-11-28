/* global Log, Class, Loader, Class , MM */
/* exported Module */

/* Magic Mirror
 * Module Blueprint.
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */



var Module = Class.extend({

	/*********************************************************
	 * All methods (and properties) below can be subclassed. *
	 *********************************************************/


	// Module config defaults.
	defaults: {},

	// Timer reference used for showHide animation callbacks.
	showHideTimer: null,

	/* init()
	 * Is called when the module is instantiated.
	 */
	init: function() {
		//Log.log(this.defaults);
	},

	/* start()
	 * Is called when the module is started.
	 */
	start: function() {
		Log.info("Starting module: " + this.name);
	},

	/* getScripts()
	 * Returns a list of scripts the module requires to be loaded.
	 *
	 * return Array<String> - An array with filenames.
	 */
	getScripts: function() {
		return [];
	},

	/* getStyles()
	 * Returns a list of stylesheets the module requires to be loaded.
	 *
	 * return Array<String> - An array with filenames.
	 */
	getStyles: function() {
		return [];
	},

	/* getTranslations()
	 * Returns a map of translation files the module requires to be loaded.
	 *
	 * return Map<String, String> - A map with langKeys and filenames.
	 */
	getTranslations: function() {
		return false;
	},

	/* getDom()
	 * This method generates the dom which needs to be displayed. This method is called by the Magic Mirror core.
	 * This method needs to be subclassed if the module wants to display info on the mirror.
	 *
	 * return domobject - The dom to display.
	 */
	getDom: function() {
		var nameWrapper = document.createElement("div");
		var name = document.createTextNode(this.name);
		nameWrapper.appendChild(name);

		console.log("NameWrapper name: "+name);

		var identifierWrapper = document.createElement("div");
		var identifier = document.createTextNode(this.identifier);
		identifierWrapper.appendChild(identifier);
		identifierWrapper.className = "small dimmed";

		var div = document.createElement("div");
		div.appendChild(nameWrapper);
		div.appendChild(identifierWrapper);

		return div;
	},

	/* notificationReceived(notification, payload, sender)
	 * This method is called when a notification arrives.
	 * This method is called by the Magic Mirror core.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 * argument sender Module - The module that sent the notification.
	 */
	notificationReceived: function(notification, payload, sender) {
		if (sender) {
			Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
		} else {
			Log.log(this.name + " received a system notification: " + notification);
		}
	},

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
		Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
	},

	/* suspend()
	 * This method is called when a module is hidden.
	 */
	suspend: function() {
		Log.log(this.name + " is suspended.");
	},

	/* resume()
	 * This method is called when a module is shown.
	 */
	resume: function() {
		Log.log(this.name + " is resumed.");
	},

	/*
	 *  restart()
	 */
	restart: function(newconfig) {
		Log.log(this.name + " is restarting.");
		this.setConfig(newconfig);
		this.start()

	},


	/*********************************************
	 * The methods below don"t need subclassing. *
	 *********************************************/

	/* setData(data)
	 * Set the module data.
	 *
	 * argument data obejct - Module data.
	 */
	setData: function(data) {
		this.data = data;
		this.name = data.name;
		this.identifier = data.identifier;
		this.hidden = false;

		this.setConfig(data.config);
	},

	/* setConfig(config)
	 * Set the module config and combine it with the module defaults.
	 *
	 * argument config obejct - Module config.
	 */
	setConfig: function(config) {
		this.config = Object.assign(this.defaults, config);
	},

	/* socket()
	 * Returns a socket object. If it doesn"t exist, it"s created.
	 * It also registers the notification callback.
	 */
	socket: function() {
		if (typeof this._socket === "undefined") {
			this._socket = this._socket = new MMSocket(this.name);
		}

		var self = this;
		this._socket.setNotificationCallback(function(notification, payload) {
			self.socketNotificationReceived(notification, payload);
		});

		return this._socket;
	},

	/* file(file)
	 * Retrieve the path to a module file.
	 *
	 * argument file string - Filename.
	 *
	 * return string - File path.
	 */
	file: function(file) {
		return this.data.path + "/" + file;
	},

	/* loadStyles()
	 * Load all required stylesheets by requesting the MM object to load the files.
	 *
	 * argument callback function - Function called when done.
	 */
	loadStyles: function(callback) {
		var self = this;
		var styles = this.getStyles();

		var loadNextStyle = function() {
			if (styles.length > 0) {
				var nextStyle = styles[0];
				Loader.loadFile(nextStyle, self, function() {
					styles = styles.slice(1);
					loadNextStyle();
				});
			} else {
				callback();
			}
		};

		loadNextStyle();
	},

	/* loadScripts()
	 * Load all required scripts by requesting the MM object to load the files.
	 *
	 * argument callback function - Function called when done.
	 */
	loadScripts: function(callback) {
		var self = this;
		var scripts = this.getScripts();

		var loadNextScript = function() {
			if (scripts.length > 0) {
				var nextScript = scripts[0];
				Loader.loadFile(nextScript, self, function() {
					scripts = scripts.slice(1);
					loadNextScript();
				});
			} else {
				callback();
			}
		};

		loadNextScript();
	},

	/* loadScripts()
	 * Load all required scripts by requesting the MM object to load the files.
	 *
	 * argument callback function - Function called when done.
	 */
	loadTranslations: function(callback) {
		var self = this;
		var translations = this.getTranslations();
		var lang = config.language.toLowerCase();

		// The variable `first` will contain the first
		// defined translation after the following line.
		for (var first in translations) {break;}

		if (translations) {
			var translationFile = translations[lang] || undefined;
			var translationsFallbackFile = translations[first];

			// If a translation file is set, load it and then also load the fallback translation file.
			// Otherwise only load the fallback translation file.
			if (translationFile !== undefined && translationFile !== translationsFallbackFile) {
				Translator.load(self, translationFile, false, function() {
					Translator.load(self, translationsFallbackFile, true, callback);
				});
			} else {
				Translator.load(self, translationsFallbackFile, true, callback);
			}
		} else {
			callback();
		}
	},

 	/* translate(key, defaultValue)
 	 * Request the translation for a given key.
 	 *
 	 * argument key string - The key of the string to translage
	 * argument defaultValue string - The default value if no translation was found. (Optional)
 	 */
	translate: function(key, defaultValue) {
		return Translator.translate(this, key) || defaultValue || "";
	},

	/* updateDom(speed)
	 * Request an (animated) update of the module.
	 *
	 * argument speed Number - The speed of the animation. (Optional)
	 */
	updateDom: function(speed) {
		MM.updateDom(this, speed);
	},

	/* sendNotification(notification, payload)
	 * Send a notification to all modules.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	sendNotification: function(notification, payload) {
		MM.sendNotification(notification, payload, this);
	},

	/* sendSocketNotification(notification, payload)
	 * Send a socket notification to the node helper.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	sendSocketNotification: function(notification, payload) {
		this.socket().sendNotification(notification, payload);
	},

	/* hideModule(module, speed, callback)
	 * Hide this module.
	 *
	 * argument speed Number - The speed of the hide animation.
	 * argument callback function - Called when the animation is done.
	 */
	hide: function(speed, callback) {
		callback = callback || function() {};

		var self = this;
		MM.hideModule(self, speed, function() {
			self.suspend();
			callback();
		});
	},

	/* showModule(module, speed, callback)
	 * Show this module.
	 *
	 * argument speed Number - The speed of the show animation.
	 * argument callback function - Called when the animation is done.
	 */
	show: function(speed, callback) {
		this.resume();
		MM.showModule(this, speed, callback);
	},


	closePopUp: function() {

		window.open("close", '_blank');					//send "close" to close the popup
		document.body.removeChild(background);

	},

	showPopUp: function() {


		var w = screen.width;//window.innerWidth;
		var h = screen.height;//window.innerHeight;

		var url = "";

		//console.log("args: "+arguments.length)
		//console.log("args[0]: "+arguments[0])
		if(this.links[arguments[0]] != undefined){
			url = this.links[arguments[0]];
		}
		else{
			url = this.links[0]
		}


		the_link = url.concat('***' + w + '****' + h + '****');
		//console.log("link: " + the_link);

		window.open(the_link, '_blank');

		background = createBackground();
		document.body.appendChild(background);

		var self = this;

		function createBackground() {

			var background = document.createElement('bg');
			background.width = window.innerWidth;
			background.height = window.innerHeight;

			background.onclick = function(event) {
				console.log("clicked background");
				//window.open("close", '_blank');					//send "close" to close the popup
				//document.body.removeChild(background);
				self.closePopUp();
			};

			return background;
		}

	}


});

Module.definitions = {};

Module.create = function(name) {

	//Define the clone method for later use.
	function cloneObject(obj) {
		if (obj === null || typeof obj !== "object") {
			return obj;
		}

		var temp = obj.constructor(); // give temp the original obj"s constructor
		for (var key in obj) {
			temp[key] = cloneObject(obj[key]);
		}

		return temp;
	}

	var moduleDefinition = Module.definitions[name];
	var clonedDefinition = cloneObject(moduleDefinition);

	// Note that we clone the definition. Otherwise the objects are shared, which gives problems.
	var ModuleClass = Module.extend(clonedDefinition);

	return new ModuleClass();

};

Module.register = function(name, moduleDefinition) {
	Log.log("Module registered: " + name);
	Module.definitions[name] = moduleDefinition;
};

var links = [];

var background;


/*
Module.showPopUp = function showPopup(link){

	link = link.concat( '***' + w + '****' + h + '****' );
	console.log("link: "+link);

	window.open(link, '_blank');

	background = createBackground();
	document.body.appendChild(background);

};*/


/*
Module.changeSetting = function showPopup(link){

	console.log("in change setting");

	//link = link.concat( '***' + w + '****' + h + '****' );
	//console.log("link: "+link);

	//window.open(link, '_blank');

	background = createBackground();
	document.body.appendChild(background);

};*/




/*
function closePopWindow() {

	window.open("close", '_blank');					//send "close" to close the popup
	document.body.removeChild(background);
}
*/
/*

function fadeOut(elementTag) {
	var element = document.body.getElementsByTagName(elementTag);
	var op = 1;  // initial opacity
	var timer = setInterval(function () {
		if (op <= 0.1){
			clearInterval(timer);
			element.style.display = 'none';
			document.removeChild(element);		//body.removeChild(element);
		}
		element.style.opacity = op;
		element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		op -= op * 0.1;
	}, 20);
}*/

/*
function fadeIn(element) {
	//var element = document.body.getElementsByTagName(elementTag);
	var op = 0.1;  // initial opacity
	if (element.style.display != null) {
		element.style.display = 'block';
		var timer = setInterval(function () {
			if (op >= .85) {
				clearInterval(timer);
			}
			element.style.opacity = op;
			element.style.filter = 'alpha(opacity=' + op * 100 + ")";
			op += op * 0.1;
		}, 10);
	}
}
*/