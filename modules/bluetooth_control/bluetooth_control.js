

Module.register("bluetooth_control",{


	// Override dom generator.
	getDom: function() {


        var container = document.createElement('bluetooth_container');
		return container;

	},


	// Override start method.
	start: function() {
		Log.log("Starting module: " + this.name);
		this.startBT();

	},

	startBT: function(){
		Log.info(this.config);
		this.sendSocketNotification("START_BLUETOOTH_LISTENER", {config: this.config});
	},

    socketNotificationReceived: function(notification, payload){

        console.log("Bluetooth Notification recieved: " + notification + " Payload: " + payload);

    }

});