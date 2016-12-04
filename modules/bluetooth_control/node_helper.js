

var NodeHelper = require("node_helper");

var exec;

module.exports = NodeHelper.create({
	
	start: function() {
		console.log("Starting module: " + this.name);
		
	},
	
	socketNotificationReceived: function(notification, payload) {
		
		console.log("Notification: " + notification + " Payload: " + payload);

		if(notification === "START_BLUETOOTH_LISTENER"){

            this.startBTListener();
		}
		
	},

	startBTListener: function(){

		console.log("starting bluetooth");

		var child;
		var exec = require('child_process').exec, child;

		setInterval(function(){
			child = exec('./modules/bluetooth_control/BTsignal.sh',
				function (error, stdout, stderr) {

					//VALUES: http://bluez-users.narkive.com/5nAqoY4A/hcitool-and-rssi-value-0
					//outputs
					//  0/1 : good
					// -1 : bad?

					if(stdout.localeCompare("")){  //connected

						var signal = stdout.replace("RSSI return value: ", "");
						console.log(signal);
					}
					else{
						//not connected
					}




				});
		}, 3000);

	},

	sendCommandToFrontEnd: function (jsonCommand) {

		console.log("sending command: " + JSON.stringify(jsonCommand));
		this.sendSocketNotification("BT_COMMAND", jsonCommand);

	}



});
