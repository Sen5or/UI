

Module.register("gesture_control",{


	// Override dom generator.
	getDom: function() {


        var canvas_container = document.createElement('canvas');
        canvas_container.id = "videoCanvas";

        var container = document.createElement("container_test");
		container.id = "gesture_container";

        container.appendChild(canvas_container);

		return container;

	},


	// Override start method.
	start: function() {
		Log.log("Starting module: " + this.name);
		this.startStream();

	},

	startStream: function(){
		Log.info(this.config);
		this.sendSocketNotification("START_GESTURE_STREAM", {config: this.config});
	},

    socketNotificationReceived: function(notification, payload){

        console.log("GESTURE Notification recieved: " + notification + " Payload: " + payload);


        if(notification === "WEB_SOCKET_CONNECTED"){            //this gets fired after the backend has initialized helper scripts
            client = new WebSocket( 'ws:localhost:8084/' );
            var canvas = document.getElementById('videoCanvas');
            player = new jsmpeg(client, {canvas:canvas});

        }
		else if (notification === "HELLO_USER") {
			this.sendNotification("HELLO_USER", payload);
		}
		else if (notification === "FACE_COMMAND") {

			var modulesToEnumerate = payload.modules;
			var counter = 0;
			MM.getModules().withClass(modulesToEnumerate).enumerate(function (module) {

				var newConfig = Object.assign(module.config, payload.configs[counter])
				module.restart(newConfig, function () {
					//Module reloaded
				});
				counter+=1;
			});
		}
    }

});


var client = null;
var player;