/* global Log, Module, moment */

/* Magic Mirror
 * Module: Compliments
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("compliments",{

	// Module config defaults.
	defaults: {
		compliments: {
			morning: [
				"Good morning",
				"Enjoy your day",
				"How was your sleep"
			],
			afternoon: [
				"Hello",
				"What's up",
				"Looking good today"
			],
			evening: [
				"Wow, looking good",
				"You look nice",
				"Where's the party at"
			]
		},
		updateInterval: 10 * 1000,
		fadeSpeed: 4 * 1000
	},

	
	
	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		this.currentUser = "";
		this.lastComplimentIndex = -1;

		// Schedule update timer.
		var self = this;
		setInterval(function() {
			self.updateDom(self.config.fadeSpeed);
		}, this.config.updateInterval);
	},

	/* randomIndex(compliments)
	 * Generate a random index for a list of compliments.
	 *
	 * argument compliments Array<String> - Array with compliments.
	 *
	 * return Number - Random index.
	 */
	randomIndex: function(compliments) {
		if (compliments.length === 1) {
			return 0;
		}

		var generate = function() {
			return Math.floor(Math.random() * compliments.length);
		};

		var complimentIndex = generate();

		while (complimentIndex === this.lastComplimentIndex) {
			complimentIndex = generate();
		}

		this.lastComplimentIndex = complimentIndex;

		return complimentIndex;
	},

	/* complimentArray()
	 * Retrieve an array of compliments for the time of the day.
	 *
	 * return compliments Array<String> - Array with compliments for the time of the day.
	 */
	complimentArray: function() {
		var hour = moment().hour();

		if (hour >= 3 && hour < 12) {
			return this.config.compliments.morning;
		} else if (hour >= 12 && hour < 17) {
			return this.config.compliments.afternoon;
		} else {
			return this.config.compliments.evening;
		}
	},

	/* complimentArray()
	 * Retrieve a random compliment.
	 *
	 * return compliment string - A compliment.
	 */
	randomCompliment: function() {
		var compliments = this.complimentArray();
		var index = this.randomIndex(compliments);

		return compliments[index];
	},

	// Override dom generator.
	getDom: function() {
		var complimentText = this.randomCompliment();
		var compliment;
		console.log("compliment userName: " + this.currentUser);
		var userName = this.currentUser;

		//Only show compliments if a name is available

		if(!userName.localeCompare("")){
			complimentText = "";
		}
		else{
			userName = userName.charAt(0).toUpperCase() + userName.slice(1);
			complimentText = complimentText + ", "+ userName
		}

		console.log("compliment to show: " + JSON.stringify(complimentText));

		compliment = document.createTextNode(complimentText);

		var wrapper = document.createElement("div");
		wrapper.className = "thin xlarge bright";
		wrapper.appendChild(compliment);

		this.currentUser = "";

		return wrapper;
	},



	notificationReceived: function(notification, payload){


		console.log("Notification recieved in compliments: " + notification + " Payload: " + payload);


		if (notification === "HELLO_USER") {
			console.log("hello user: "+payload)
			this.currentUser = payload;
			this.updateDom(self.config.fadeSpeed);
		}

	}

});
