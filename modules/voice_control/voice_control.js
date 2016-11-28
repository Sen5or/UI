

Module.register("voice_control",{


	// Override dom generator.
	getDom: function() {




		var container = document.createElement("voice_container");
		return container;

	},


	// Override start method.
	start: function() {
		Log.log("Starting module: " + this.name);
		this.sendSocketNotification("START_VOICE_CONTROL", {config: this.config});

	},

    socketNotificationReceived: function(notification, payload){

        console.log("VOICE Notification recieved: " + notification + " Payload: " + payload);


        if(notification === "VOICE_COMMAND"){

            var action = payload.action;

            var counter = 0;
            MM.getModules().withClass(payload.modules).enumerate(function(module) {

                counter += 1;
                console.log("enumerating: "+counter);
                if(action === "open"){
                    module.showPopUp();
                }
                else if(action === "close"){
                    module.closePopUp()
                }
                else if(action === "show"){
                    module.show(1000, function() {
                        //Module shown.
                    });
                }
                else if(action === "hide"){
                    module.hide(1000, function() {
                        //Module hidden
                    });
                }
                else if(action === "restart"){
                    module.restart(payload.configs[counter], function() {
                        //Module reloaded
                    });

                }



                /*else if(action === "move"){
                    module.move(1000, function() {

                    });
                }*/

            });

        }

    }

});


/*
var timeout;
document.onmousemove = function(){

	showIcon();

	clearTimeout(timeout);
	timeout = setTimeout(function(){
		hideIcon();
	}, 1000);
};
*/


