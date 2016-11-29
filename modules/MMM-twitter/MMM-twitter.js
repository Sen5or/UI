Module.register("MMM-twitter",{


	defaults: {
		maxNumTweets: 5,
		api_keys: {
			consumer_key: 'GCNRascd1LbQMYXr9Se1MpQEB',
			consumer_secret: 'aWtJSOIhZUh3yD4N68pjwPlqhLUAWnW6mC4ktqSggC9uJai3uh',
			access_token_key: '1528289544-7mtiB0PN0cTH07gsfRo6KwHKZisB1wdXdLrAVy0',
			access_token_secret: 'm4yRpvZtXd6mx3gyUZe5O0muz7Fb1sDV2BS6UJgOJBmCl'
		},
		reloadInterval:  1 * 60 * 1000, // every 5 minutes
		updateInterval: 5 * 1000,
		animationSpeed: 2.5 * 1000
	},


	
	start: function() {
		Log.info("Starting module: " + this.name);



		this.config = Object.assign(this.config, defaults);

		this.links = [];
		this.startStream();


	},
	
	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},
	
	startStream: function(){
		console.log("Starting twitter stream with: ");
		console.log(this.config)
		this.tweets = [];
		this.sendSocketNotification("START_TWITTER", {config: this.config});
	},


	socketNotificationReceived: function (notification, payload) {

		//console.log("Twitter Notification: " + notification + " Payload: " + payload);

		if (notification === "TWITTER_DATA") {
				this.tweets = payload;
				this.updateDom(1.5 * 1000);
		}


	},

	// Override dom generator.
	getDom: function() {
		var self = this;
		var wrapper = document.createElement("div");
		var title = document.createElement("div");

		title.className = "small bright";
		title.innerHTML = "Twitter Feed";
		wrapper.appendChild(title);
		for(var t in this.tweets){
			
				var tweetElement = document.createElement("div");
				tweetElement.className = "bright xsmall light";
				tweetElement.innerHTML = this.tweets[t].text;						//Using text
				tweetElement.tweetIndex = t;

				var author = document.createElement("div");
				author.className = "xsmall light";
				author.innerHTML = "@"+this.tweets[t].user.screen_name;
				//author.innerHTML += " | " + this.tweets[t].date.prototype.toLocaleString();

				var spacer = document.createElement("div");
				spacer.className = "bright xsmall light";
				//spacer.innerHTML = "<br>";


				var twitterId = this.tweets[t].id_str;
				self.links[t] = "https://twitter.com/statuses/"+twitterId;

				tweetElement.onclick = function(){
					//console.log("t: "+tweetElement.tweetId);
					//console.log("t: "+self.tweetId);
					console.log("t: "+this.tweetIndex);
					self.showPopUp(this.tweetIndex);
				};

				wrapper.appendChild(tweetElement);
				wrapper.appendChild(author);
				wrapper.appendChild(spacer);
		}
		return wrapper;
	}
});

var counter = 0;
var lastUpdate = new Date();