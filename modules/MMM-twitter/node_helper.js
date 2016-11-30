
var NodeHelper = require("node_helper");
var Twitter = require('twitter');

module.exports = NodeHelper.create({
	
	start: function() {
		console.log("Starting module: " + this.name);
	},
	
	socketNotificationReceived: function(notification, payload) {

		var self = this;
		console.log("TWITTER Notification: " + notification + " Payload: " + payload);
		
		if(notification === "START_TWITTER"){

			this.config = payload.config;

			this.twitterClient = new Twitter({
				consumer_key: this.config.api_keys.consumer_key,
				consumer_secret: this.config.api_keys.consumer_secret,
				access_token_key: this.config.api_keys.access_token_key,
				access_token_secret: this.config.api_keys.access_token_secret
			});

			self.queryTwitter();

			setInterval(
				function () {
					self.queryTwitter();
				}, 15000);

		}
		
	},
	
	queryTwitter: function(){


		var self = this;

		this.twitterClient.get('search/tweets', this.config.query, function(error, tweets, response) {

			self.sendSocketNotification("TWITTER_DATA", tweets.statuses);
		});


	}

});

