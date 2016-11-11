/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("spacer",{



	// Default module config.
	defaults: {
		text: "This is spacer"
	},

	// Override dom generator.
	getDom: function() {

		var container = document.createElement("container_test");
		var break1 = document.createElement("br");
		container.appendChild(break1);
		return container;

	}


});
