
var NodeHelper = require("node_helper");
var Twitter = require('twitter');

module.exports = NodeHelper.create({
	
	start: function() {
		console.log("Starting module: " + this.name);
		
	},
	
	socketNotificationReceived: function(notification, payload) {
		
		console.log("Notification: " + notification + " Payload: " + payload);
		
		if(notification === "START_STREAM"){
			this.startTwitterStream(payload.config);
		}
		
	},
	
	startTwitterStream: function(config){

		var self = this;

		var client = new Twitter({
			consumer_key: config.api_keys.consumer_key,
			consumer_secret: config.api_keys.consumer_secret,
			access_token_key: config.api_keys.access_token_key,
			access_token_secret: config.api_keys.access_token_secret
		});


		var stream = client.stream('statuses/filter', config.keywords);  //{track: 'javascript'});
		stream.on('data', function(event) {
			self.sendSocketNotification("DATA", event);
		});

		stream.on('error', function(error) {
			console.log("twitter stream api error");
			throw error;
		});

	}

});
