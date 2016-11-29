

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


        if (notification === "VOICE_COMMAND") {

            var action = payload.action;

            console.log(payload)

            var modName = isModule(payload.modName);


            if (action === "close" || action === "clothes") {         //Any module can close the global popup
                this.closePopUp()
            }
            else if(modName != null){

                var counter = 0;
                MM.getModules().withClass(modName).enumerate(function (module) {


                    console.log("enumerating: " + counter);
                    if (action === "open") {
                        module.showPopUp();
                    }
                    else if(action === "close" || action === "clothes"){
                     module.closePopUp()
                     }
                    else if (action === "show") {
                        module.show(1000, function () {
                            //Module shown.
                        });
                    }
                    else if (action === "hide" || action === "hyde") {
                        module.hide(1000, function () {
                            //Module hidden
                        });
                    }
                    else if (action === "restart") {
                        module.restart(payload.configs[counter], function () {
                            //Module reloaded
                        });
                    }
                    counter += 1;
                });

            }

        }


        function isModule(word) {


            for (var m in config.modules) {

                if (config.modules[m].module.includes(word)) {
                    console.log("matched " + config.modules[m].module);
                    return config.modules[m].module;
                }

            }
            return null;
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


