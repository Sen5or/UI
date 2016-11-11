/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("helloworld",{



	// Default module config.
	defaults: {
		text: "Yo this is Hello World!"
	},

	// Override dom generator.
	getDom: function() {


		var container = document.createElement("container_test");

		var break1 = document.createElement("br");
/*
		var text = document.createElement("text");
		text.innerHTML = this.config.text;

		var button1 = document.createElement("BUTTON");
		button1.id = "button1";
		var button2 = document.createElement("BUTTON");
		var button_text = document.createTextNode("cursor off");
		var button_text2 = document.createTextNode("cursor on");
		button1.appendChild(button_text);
		button2.appendChild(button_text2);

		button1.onclick = function() {
			console.log("testing click");
			var myElement = document.querySelector("html");
			myElement.style.cursor = "none";
		};

		button2.onclick = function() {
			console.log("testing click");
			var myElement = document.querySelector("html");
			myElement.style.cursor = "auto";
		};


		container.appendChild(button1);
		container.appendChild(break1);
		container.appendChild(button2);

*/
		container.appendChild(break1);
		return container;

	}


});
