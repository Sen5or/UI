/* global  Log, Loader, Module, config, defaults */
/* jshint -W020 */

/* Magic Mirror
 * Main System
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var MM = (function() {

	var modules = [];


	/* createDomObjects()
	 * Create dom objects for all modules that
	 * are configured for a specific position.
	 */
	var createDomObjects = function() {
		for (var m in modules) {
			var module = modules[m];

			createAndPlaceModule(module);

		}

		sendNotification("DOM_OBJECTS_CREATED");
	};


	var createAndPlaceModule = function(module){

		if (typeof module.data.position === "string") {

			//Wrap location to dom
			var wrapper = selectWrapper(module.data.position);						/* Module Position*/

			//Create empty dom to be populated for module
			var dom = document.createElement("div");
			dom.id = module.identifier;
			dom.className = module.name;
			dom.position = module.data.position;

			console.log("creating: "+ module.identifier + " at " + module.data.position);

			if (typeof module.data.classes === "string") {
				dom.className = "module " + dom.className + " " + module.data.classes;
			}

			dom.opacity = 0;
			wrapper.appendChild(dom);

			if (typeof module.data.header !== "undefined" && module.data.header !== "") {
				var moduleHeader = document.createElement("header");
				moduleHeader.innerHTML = module.data.header;
				dom.appendChild(moduleHeader);
			}

			var moduleContent = document.createElement("div");
			moduleContent.className = "module-content";
			dom.appendChild(moduleContent);

			//addClickListenerToDom(dom, module); //.data.position);

			updateDom(module, 0);
		}

	};


	/*
	var swapModules = function(module1, module2){

		console.log("Mod1: "+ module1.id + " at " + module1.position);
		console.log("Mod2: "+ module2.id + " at " + module2.position);

		var tempLocation = module1.position;

		//attach mod1
		module1.position = module2.position;
		var wrapper1 = selectWrapper(module1.position);
		module1.opacity = 0;
		wrapper1.appendChild(module1);

		//var element = document.getElementById(module1.id);
		//element.parentNode.removeChild(element);


		module2.position = tempLocation;
		var wrapper2 = selectWrapper(module2.position);
		module2.opacity = 0;
		wrapper2.appendChild(module2);

	};*/


	var followCursor = false;
	/***
	 *
	 * Determine start location, determine which region cursor has moved to,
	 * update selected module location, and location of module that is in the new place. --- just swap them for now?
	 * @param dom
	 * @param position
     */

	var addClickListenerToDom = function(dom, module) {      // This should actually become active when gestures are sensed....
		dom.onclick = function(event) {

			console.log("clicked: " + dom.id + " at "+ module.data.position);

			console.log("news: " + JSON.stringify(module.clickable));

			if(module.clickable != null)
				showPopup(module.clickable);

			/*
			if(selected == null){
				selectElement(dom, event);
			}

			if(document.onmousemove == null) {
				startHoverChecker();
			}
			else{
				//console.log("SWAP: " + selected.id + " from "+ selected.data.position +" with "+ dom.id + " at " + module.data.position);
				swapModules(selected, dom);
				stopHoverChecker();
			}*/

		};
	};

	var page1 = "http://www.nytimes.com/pages/index.html?partner=rss&emc=rss";
	var page = "http://www.nytimes.com/2016/11/08/business/international/china-cyber-security-regulations.html?partner=rss&emc=rss";
	var ytube = "https://www.youtube.com/watch?v=NVHiI2azL7U";
	ytube = ytube.replace("watch?v=", "embed/");


	/*
	var background;

	function createBackground() {

		background = document.createElement('bg');
		background.width = window.innerWidth;
		background.height = window.innerHeight;

		background.onclick = function(event) {
			console.log("clicked background")
			fadeOut(background);
			//document.body.removeChild(background);
		};

		return background;
	}

	function createIframe(link) {

		var iframe = document.createElement('iframe');
		var w = window.innerWidth;
		var h = window.innerHeight;
		var divW = w-250;
		var divH = h-250;

		iframe.id = "popUpNews";

		var html = link;
		//iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
		iframe.src = html;

		console.log("html_link: " +html);

		return iframe;

	}



	function showIframe() {

		var iframe = document.getElementsByTagName('iframe')[0];
		var url = iframe.src;


		var getData = function (data) {

			try{
				console.log("Getting data");
				if (data && data.query && data.query.results &&
					data.query.results.resources &&
					data.query.results.resources.content &&
					data.query.results.resources.status == 200) {
					console.log("Success loaded");
					loadHTML(data.query.results.resources.content);
				}
				else if (data && data.error && data.error.description){
					console.log("Error loaded");
					loadHTML(data.error.description);
				}
				else {
					console.log("HTML error loaded");
					loadHTML('Error: Cannot load ' + url);
				}
			}
			catch (error){
				console.log("caught error loading data:");
				console.log(error);
			}


		};
		var loadURL = function (src) {
			url = src;
			var script = document.createElement('script');
			script.src = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.headers%20where%20url%3D%22' + encodeURIComponent(url) + '%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=getData';
			console.log("loadurl result: "+script.src);
			document.body.appendChild(script);
		};
		var loadHTML = function (html) {
			console.log("loading html");
			iframe.src = 'about:blank';
			iframe.contentWindow.document.open();
			iframe.contentWindow.document.write(html.replace(/<head>/i, '<head><base href="' + url + '"><scr' + 'ipt>document.addEventListener("click", iframeClick);</scr' + 'ipt>'));
			iframe.contentWindow.document.close();
		};
		loadURL(iframe.src);


		var iframeClick = function(e) {
			if(e.target && e.target.nodeName == "A") {
				e.preventDefault(); parent.loadURL(e.target.href);
			}
		};

		iframe.onload=function(){
			console.log('laoded the iframe')
		};

	}

	function showPopup(link){

		var background = createBackground();
		var iframe = createIframe(link);

		background.appendChild(iframe);
		document.body.appendChild(background);
		fadeIn(background);

		//console.log('iframe.contentWindow =', iframe.contentWindow);
		showIframe();
	}

*/
	/**
	 * The currently selected element gets a copy made of it for "floating" effect
	 * @param dom
	 * @param event
	 */
	/*
	var selectElement = function (dom, event) {
		console.log("Selected: " + dom);
		selected = dom;
		selected.style.backgroundColor = 'red';


		selectedCopy = selected.cloneNode(true);
		selectedCopy.style.position = "absolute";
		selectedCopy.height = selected.offsetHeight;
		selectedCopy.width = selected.offsetWidth;
		selectedCopy.style.left = selected.style.left;
		selectedCopy.style.top = selected.style.top;
		selectedCopy.id = "selected-copy";
		selectedCopy.style.margin = -50 + "px";

		document.body.appendChild(selectedCopy);

		selectedCopy.style.left = selected.style.left;
		selectedCopy.style.top = selected.style.top;
		placeDiv(event.pageX, event.pageY);

	};

	var selected = null;
	var selectedCopy = null;
	var previous_hover = null;
	var current_hover = null;
	*/

	function fadeOut(element) {
		var op = 1;  // initial opacity
		var timer = setInterval(function () {
			if (op <= 0.1){
				clearInterval(timer);
				element.style.display = 'none';
				document.body.removeChild(element);
			}
			element.style.opacity = op;
			element.style.filter = 'alpha(opacity=' + op * 100 + ")";
			op -= op * 0.1;
		}, 20);
	}


	function fadeIn(element) {
		var op = 0.1;  // initial opacity
		element.style.display = 'block';
		var timer = setInterval(function () {
			if (op >= .85){
				clearInterval(timer);
			}
			element.style.opacity = op;
			element.style.filter = 'alpha(opacity=' + op * 100 + ")";
			op += op * 0.1;
		}, 10);
	}

	/**
	 * Starts tracking the location of the cursor, moves the selectedCopy to the x,y coord
	 */
	/*
	var startHoverChecker = function () {

		document.onmousemove = handleMouseMove;

		var myElement = document.querySelector("html");
		myElement.style.cursor = "move";


		function handleMouseMove(event) {
			var dot, eventDoc, doc, body, pageX, pageY;

			event = event || window.event; // IE-ism

			// If pageX/Y aren't available and clientX/Y are,
			// calculate pageX/Y - logic taken from jQuery.
			// (This is to support old IE)
			if (event.pageX == null && event.clientX != null) {
				eventDoc = (event.target && event.target.ownerDocument) || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = event.clientX +
					(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
					(doc && doc.clientLeft || body && body.clientLeft || 0);
				event.pageY = event.clientY +
					(doc && doc.scrollTop || body && body.scrollTop || 0) -
					(doc && doc.clientTop || body && body.clientTop || 0 );
			}

			var element = document.elementFromPoint(event.pageX, event.pageY);
			// Use event.pageX / event.pageY here
			//console.log(event.pageX + ", " + event.pageY);


			var temp = isDescendant(element);
			if(temp[0] && selected != temp[1]){

				console.log("Hover: "+ temp[1].id  + ". (" + temp[1].offsetWidth + ", " +temp[1].offsetHeight + ")");


				if(temp[1] != current_hover){

					if(current_hover != null)
						current_hover.style.backgroundColor = 'transparent';

					previous_hover = current_hover;
					current_hover = temp[1];
					current_hover.style.backgroundColor = '#035207';

				}
			}
			placeDiv(event.pageX, event.pageY);
		}

	};

*/

/*
	function getMouseCoords(event) {
		var dot, eventDoc, doc, body, pageX, pageY;

		document.onmou
		event = event || window.event; // IE-ism

		// If pageX/Y aren't available and clientX/Y are,
		// calculate pageX/Y - logic taken from jQuery.
		// (This is to support old IE)
		if (event.pageX == null && event.clientX != null) {
			eventDoc = (event.target && event.target.ownerDocument) || document;
			doc = eventDoc.documentElement;
			body = eventDoc.body;

			event.pageX = event.clientX +
				(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
				(doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY +
				(doc && doc.scrollTop || body && body.scrollTop || 0) -
				(doc && doc.clientTop || body && body.clientTop || 0 );
		}

		var element = document.elementFromPoint(event.pageX, event.pageY);
		// Use event.pageX / event.pageY here
		//console.log(event.pageX + ", " + event.pageY);

		placeDiv(event.pageX, event.pageY);
	}
*/


	/**
	 * Stops tracking cursor, resets any selected backgrounds, and removes selectedCopy from the UI
	 */
	/*
	var stopHoverChecker = function () {

		document.onmousemove = null;

		var myElement = document.querySelector("html");
		myElement.style.cursor = "default";

		if(selected != null)
			selected.style.backgroundColor = 'transparent';

		if(current_hover != null)
			current_hover.style.backgroundColor = 'transparent';

		if(previous_hover != null)
				previous_hover.style.backgroundColor = 'transparent';

		document.body.removeChild(selectedCopy);

		previous_hover = null;
		current_hover = null;
		selected = null;

	};*/


	/**
	 * Helper method to determine if child element is part of a module tree.
	 * @param child
	 * @returns {*[]}
	 */
	function isDescendant(child) {
		var node = child;
		while (node != null) {
			if(node.id != undefined && node.id.includes("module")) {
				return [true, node];
			}
			node = node.parentNode;
		}
		return [false, null];
	}


	/** LOCATION OPTIONS
	 *
	 * top_bar,
	 * top_left,
	 * top_center,
	 * top_right,
	 * upper_third,
	 * middle_center,
	 * lower_third,
	 * bottom_left,
	 * bottom_center,
	 * bottom_right,
	 * bottom_bar,
	 * fullscreen_above
	 * fullscreen_below
	 *
	 */


/*
	var listenToCursor = function (dom, position) {

			document.onmousemove = handleMouseMove;


			function handleMouseMove(event) {
				var dot, eventDoc, doc, body, pageX, pageY;

				event = event || window.event; // IE-ism

				// If pageX/Y aren't available and clientX/Y are,
				// calculate pageX/Y - logic taken from jQuery.
				// (This is to support old IE)
				if (event.pageX == null && event.clientX != null) {
					eventDoc = (event.target && event.target.ownerDocument) || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					event.pageX = event.clientX +
						(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
						(doc && doc.clientLeft || body && body.clientLeft || 0);
					event.pageY = event.clientY +
						(doc && doc.scrollTop || body && body.scrollTop || 0) -
						(doc && doc.clientTop || body && body.clientTop || 0 );
				}

				// Use event.pageX / event.pageY here
				console.log(event.pageX + ", " + event.pageY);


				console.log("followCursor inside: "+followCursor);

				if (!followCursor) {
					document.onmousemove = null;
				}
				else{
					orig_width = document.getElementById('module_3_calendar').offsetWidth;
					orig_height = document.getElementById('module_3_calendar').offsetHeight;
					placeDiv(document.getElementById('module_3_calendar'), event.pageX, event.pageY);
				}

			}
	};
*/

	/**
	 * Moves a div to the coordinate location
	 * @param div
	 * @param x_pos
	 * @param y_pos
     */
	function placeDiv(x_pos, y_pos) {


		var vertical_adjust = 0; //((selectedCopy.offsetHeight)/2);
		var horizontal_adjust = ((selectedCopy.offsetWidth)/2);

		//console.log("offsetWidth: "+selectedCopy.offsetWidth + ". x_pos : "+x_pos);
		//console.log("offsetHeight: "+selectedCopy.offsetHeight + ". y_pos : "+y_pos);

		selectedCopy.style.left = (x_pos-horizontal_adjust)+'px'; //-(200)
		selectedCopy.style.top = (y_pos-vertical_adjust)+'px'; //(y_pos)-(300)+'px';  //300

	}








	/////*********************   Original Magic_mirror below *************************//////


	/* selectWrapper(position)
	 * Select the wrapper dom object for a specific position.
	 *
	 * argument position string - The name of the position.
	 */
	var selectWrapper = function(position) {
		console.log("In wrapper: "+position);

		var classes = position.replace("_"," ");
		var parentWrapper = document.getElementsByClassName(classes);
		if (parentWrapper.length > 0) {
			var wrapper =  parentWrapper[0].getElementsByClassName("container");
			if (wrapper.length > 0) {
				return wrapper[0];
			}
		}
	};


	/* sendNotification(notification, payload, sender)
	 * Send a notification to all modules.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 * argument sender Module - The module that sent the notification.
	 */
	var sendNotification = function(notification, payload, sender) {
		for (var m in modules) {
			var module = modules[m];
			if (module !== sender) {
				module.notificationReceived(notification, payload, sender);
			}
		}
	};

	/* updateDom(module, speed)
	 * Update the dom for a specific module.
	 *
	 * argument module Module - The module that needs an update.
	 * argument speed Number - The number of microseconds for the animation. (optional)
	 */
	var updateDom = function(module, speed) {
		var newContent = module.getDom();

		if (!module.hidden) {

			if (!moduleNeedsUpdate(module, newContent)) {
				return;
			}

			if (!speed) {
				updateModuleContent(module, newContent);
				return;
			}

			hideModule(module, speed / 2, function() {
				updateModuleContent(module, newContent);
				if (!module.hidden) {
					showModule(module, speed / 2);
				}
			});
		} else {
			updateModuleContent(module, newContent);
		}
	};

	/* moduleNeedsUpdate(module, newContent)
	 * Check if the content has changed.
	 *
	 * argument module Module - The module to check.
	 * argument newContent Domobject - The new content that is generated.
	 *
	 * return bool - Does the module need an update?
	 */
	var moduleNeedsUpdate = function(module, newContent) {
		var moduleWrapper = document.getElementById(module.identifier);
		var contentWrapper = moduleWrapper.getElementsByClassName("module-content")[0];

		var tempWrapper = document.createElement("div");
		tempWrapper.appendChild(newContent);

		return tempWrapper.innerHTML !== contentWrapper.innerHTML;
	};

	/* moduleNeedsUpdate(module, newContent)
	 * Update the content of a module on screen.
	 *
	 * argument module Module - The module to check.
	 * argument newContent Domobject - The new content that is generated.
	 */
	var updateModuleContent = function(module, content) {
		var moduleWrapper = document.getElementById(module.identifier);
		var contentWrapper = moduleWrapper.getElementsByClassName("module-content")[0];			//TODO

		contentWrapper.innerHTML = "";
		contentWrapper.appendChild(content);
	};

	/* hideModule(module, speed, callback)
	 * Hide the module.
	 *
	 * argument module Module - The module to hide.
	 * argument speed Number - The speed of the hide animation.
	 * argument callback function - Called when the animation is done.
	 */
	var hideModule = function(module, speed, callback) {
		var moduleWrapper = document.getElementById(module.identifier);
		if (moduleWrapper !== null) {
			moduleWrapper.style.transition = "opacity " + speed / 1000 + "s";
			moduleWrapper.style.opacity = 0;

			clearTimeout(module.showHideTimer);
			module.showHideTimer = setTimeout(function() {
				// To not take up any space, we just make the position absolute.
				// since it"s fade out anyway, we can see it lay above or
				// below other modules. This works way better than adjusting
				// the .display property.
				moduleWrapper.style.position = "absolute";

				if (typeof callback === "function") { callback(); }
			}, speed);
		}
	};

	/* showModule(module, speed, callback)
	 * Show the module.
	 *
	 * argument module Module - The module to show.
	 * argument speed Number - The speed of the show animation.
	 * argument callback function - Called when the animation is done.
	 */
	var showModule = function(module, speed, callback) {
		var moduleWrapper = document.getElementById(module.identifier);
		if (moduleWrapper !== null) {
			moduleWrapper.style.transition = "opacity " + speed / 1000 + "s";
			// Restore the postition. See hideModule() for more info.
			moduleWrapper.style.position = "static";
			moduleWrapper.style.opacity = 1;

			clearTimeout(module.showHideTimer);
			module.showHideTimer = setTimeout(function() {
				if (typeof callback === "function") { callback(); }
			}, speed);

		}
	};

	/* loadConfig()
	 * Loads the core config and combines it with de system defaults.
	 */
	var loadConfig = function() {
		if (typeof config === "undefined") {
			config = defaults;
			Log.error("Config file is missing! Please create a config file.");
			return;
		}

		config = Object.assign(defaults, config);
	};

	/* setSelectionMethodsForModules()
	 * Adds special selectors on a collection of modules.
	 *
	 * argument modules array - Array of modules.
	 */
	var setSelectionMethodsForModules = function(modules) {

		/* withClass(className)
		 * filters a collection of modules based on classname(s).
		 *
		 * argument className string/array - one or multiple classnames. (array or space devided)
		 *
		 * return array - Filtered collection of modules.
		 */
		var withClass = function(className) {
			var searchClasses = className;
			if (typeof className === "string") {
				searchClasses = className.split(" ");
			}

			var newModules = modules.filter(function(module) {
				var classes = module.data.classes.toLowerCase().split(" ");

				for (var c in searchClasses) {
					var searchClass = searchClasses[c];
					if (classes.indexOf(searchClass.toLowerCase()) !== -1) {
						return true;
					}
				}

				return false;
			});

			setSelectionMethodsForModules(newModules);
			return newModules;
		};

		/* exceptWithClass(className)
		 * filters a collection of modules based on classname(s). (NOT)
		 *
		 * argument className string/array - one or multiple classnames. (array or space devided)
		 *
		 * return array - Filtered collection of modules.
		 */
		var exceptWithClass  = function(className) {
			var searchClasses = className;
			if (typeof className === "string") {
				searchClasses = className.split(" ");
			}

			var newModules = modules.filter(function(module) {
				var classes = module.data.classes.toLowerCase().split(" ");

				for (var c in searchClasses) {
					var searchClass = searchClasses[c];
					if (classes.indexOf(searchClass.toLowerCase()) !== -1) {
						return false;
					}
				}

				return true;
			});

			setSelectionMethodsForModules(newModules);
			return newModules;
		};

		/* exceptModule(module)
		 * Removes a module instance from the collection.
		 *
		 * argument module Module object - The module instance to remove from the collection.
		 *
		 * return array - Filtered collection of modules.
		 */
		var exceptModule = function(module) {
			var newModules = modules.filter(function(mod) {
				return mod.identifier !== module.identifier;
			});

			setSelectionMethodsForModules(newModules);
			return newModules;
		};

		/* enumerate(callback)
		 * Walks thru a collection of modules and executes the callback with the module as an argument.
		 *
		 * argument callback function - The function to execute with the module as an argument.
		 */
		var enumerate = function(callback) {
			modules.map(function(module) {
				callback(module);
			});
		};

		if (typeof modules.withClass === "undefined") { Object.defineProperty(modules, "withClass",  {value: withClass, enumerable: false}); }
		if (typeof modules.exceptWithClass === "undefined") { Object.defineProperty(modules, "exceptWithClass",  {value: exceptWithClass, enumerable: false}); }
		if (typeof modules.exceptModule === "undefined") { Object.defineProperty(modules, "exceptModule",  {value: exceptModule, enumerable: false}); }
		if (typeof modules.enumerate === "undefined") { Object.defineProperty(modules, "enumerate",  {value: enumerate, enumerable: false}); }
	};

	return {
		/* Public Methods */

		/* init()
		 * Main init method.
		 */
		init: function() {
			Log.info("Initializing MagicMirror.");
			loadConfig();
			Translator.loadCoreTranslations(config.language);
			Loader.loadModules();
		},

		/* modulesStarted(moduleObjects)
		 * Gets called when all modules are started.
		 *
		 * argument moduleObjects array<Module> - All module instances.
		 */
		modulesStarted: function(moduleObjects) {
			modules = [];
			for (var m in moduleObjects) {
				var module = moduleObjects[m];
				modules[module.data.index] = module;
			}

			Log.info("All modules started!");
			sendNotification("ALL_MODULES_STARTED");

			createDomObjects();
		},

		/* sendNotification(notification, payload, sender)
		 * Send a notification to all modules.
		 *
		 * argument notification string - The identifier of the noitication.
		 * argument payload mixed - The payload of the notification.
		 * argument sender Module - The module that sent the notification.
		 */
		sendNotification: function(notification, payload, sender) {
			if (arguments.length < 3) {
				Log.error("sendNotification: Missing arguments.");
				return;
			}

			if (typeof notification !== "string") {
				Log.error("sendNotification: Notification should be a string.");
				return;
			}

			if (!(sender instanceof Module)) {
				Log.error("sendNotification: Sender should be a module.");
				return;
			}

			// Further implementation is done in the private method.
			sendNotification(notification, payload, sender);
		},

		/* updateDom(module, speed)
		 * Update the dom for a specific module.
		 *
		 * argument module Module - The module that needs an update.
		 * argument speed Number - The number of microseconds for the animation. (optional)
		 */
		updateDom: function(module, speed) {
			if (!(module instanceof Module)) {
				Log.error("updateDom: Sender should be a module.");
				return;
			}

			// Further implementation is done in the private method.
			updateDom(module, speed);
		},

		/* getModules(module, speed)
		 * Returns a collection of all modules currently active.
		 *
		 * return array - A collection of all modules currently active.
		 */
		getModules: function() {
			setSelectionMethodsForModules(modules);
			return modules;
		},

		/* hideModule(module, speed, callback)
		 * Hide the module.
		 *
		 * argument module Module - The module hide.
		 * argument speed Number - The speed of the hide animation.
		 * argument callback function - Called when the animation is done.
		 */
		hideModule: function(module, speed, callback) {
			module.hidden = true;
			hideModule(module, speed, callback);
		},

		/* showModule(module, speed, callback)
		 * Show the module.
		 *
		 * argument module Module - The module show.
		 * argument speed Number - The speed of the show animation.
		 * argument callback function - Called when the animation is done.
		 */
		showModule: function(module, speed, callback) {
			module.hidden = false;
			showModule(module, speed, callback);
		}
	};

})();

// Add polyfill for Object.assign.
if (typeof Object.assign != "function") {
	(function() {
		Object.assign = function(target) {
			"use strict";
			if (target === undefined || target === null) {
				throw new TypeError("Cannot convert undefined or null to object");
			}
			var output = Object(target);
			for (var index = 1; index < arguments.length; index++) {
				var source = arguments[index];
				if (source !== undefined && source !== null) {
					for (var nextKey in source) {
						if (source.hasOwnProperty(nextKey)) {
							output[nextKey] = source[nextKey];
						}
					}
				}
			}
			return output;
		};
	})();
}

MM.init();

/*
var remote  = require('remote');
var Menu    = remote.require('menu');
var ipc     = require('ipc');

var menu = Menu.buildFromTemplate([
	{
		label: 'Electron',
		submenu: [
			{
				label: 'Options',
				click: function() {
					ipc.send('display-options');
				}
			}
		]
	}
]);

Menu.setApplicationMenu(menu);

	*/