Module.register("MMM-twitter",{

	// Default module config.
	defaults: {
		maxNumTweets: 0,
		api_keys: {
			consumer_key: '',
			consumer_secret: '',
			access_token_key: '',
			access_token_secret: ''
		},
	},
	
	start: function() {
		Log.info(this.config);
		Log.info("Starting module: " + this.name);
		if(this.config.maxNumTweets < 1){
			this.config.maxNumTweets = 0;
		}
		this.startStream();
	},
	
	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},
	
	startStream: function(){
		Log.info(this.config);
		this.tweets = [];
		this.sendSocketNotification("START_STREAM", {config: this.config});
	},



	socketNotificationReceived: function(notification, payload){

		//console.log("got socket notification");

		var self = this;

		var currentDate = new Date().getTime();
		var diff = (currentDate - lastUpdate.getTime());
		//console.log("currentDate: "+ diff);

		//if(lastUpdate)
		//setInterval(function () {
		if(diff > 5000) {
			if (notification === "DATA") {
				if (payload.text != null) {
					payload.date = new Date();
					self.tweets.push(payload);
					if (self.tweets.length > self.config.maxNumTweets && self.config.maxNumTweets != 0) {
						self.tweets.splice(0, 1);
					}
					lastUpdate = new Date();
					self.updateDom(2 * 1000);
				}
			}
			//}, 5000);
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
				tweetElement.tweetId = t;

				var author = document.createElement("div");
				author.className = "xsmall light";
				author.innerHTML = "@"+this.tweets[t].user.screen_name;
				//author.innerHTML += " | " + this.tweets[t].date.prototype.toLocaleString();

				var spacer = document.createElement("div");
				spacer.className = "bright xsmall light";
				//spacer.innerHTML = "<br>";


				tweetElement.onclick = function(){
					//console.log("t: "+tweetElement.tweetId);
					//console.log("t: "+self.tweetId);
					console.log("t: "+this.tweetId);
					//console.log("clicked twitter item: "+JSON.stringify(self.tweets[t].text));
					var twitterId = self.tweets[this.tweetId].id_str;
					var link = "https://twitter.com/statuses/"+twitterId;
					Module.showPopUp(link);
				};



				wrapper.appendChild(tweetElement);
				wrapper.appendChild(author);
				wrapper.appendChild(spacer);
				wrapper.link = this.tweets[t].id_str;
		}
		return wrapper;
	}
});

var lastUpdate = new Date();