Module.register("voice_control", {


    // Override dom generator.
    getDom: function () {

        var container = document.createElement("voice_container");

        for(var t in this.rawText){


            if(t > 2){
                break;
            }

            var textEntry = document.createElement("div");
            textEntry.className = "bright xsmall light";
            textEntry.innerHTML = this.rawText[t];

            /*
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
*/
            container.appendChild(textEntry);
            //container.appendChild(author);
            //container.appendChild(spacer);



        }


        return container;

    },



    // Override start method.
    start: function () {
        Log.log("Starting module: " + this.name);

        this.rawText = [];
        this.sendSocketNotification("START_VOICE_CONTROL", {config: this.config, currentUser: MM.getCurrentUser()});

    },

    socketNotificationReceived: function (notification, payload) {

        console.log("VOICE Notification recieved: " + notification + " Payload: " + payload);



        if (notification === "RAW_TEXT") {

            //Add raw text to datastructure...at the front
            this.rawText.unshift(payload);
            this.updateDom(1000);
            var self = this;


            //hide old voice commands after a few seconds
            clearInterval(this.timer);
            this.timer = setTimeout(function () {
                self.rawText = [];
                self.updateDom(1000);
            }, 5000);

        }
        else if (notification === "VOICE_COMMAND") {

            var action = payload.action;

            //console.log(payload);

            var modulesToEnumerate = null;
            if (payload.hasOwnProperty("modName"))
                modulesToEnumerate = payload.modName;
            else if (payload.hasOwnProperty("modules"))
                modulesToEnumerate = payload.modules;
            else {

            }


            if (action === "close" || action === "clothes") {         //Any module can close the global popup
                this.closePopUp()
            }
            else if (modulesToEnumerate != null) {

                console.log("enumerating modules ")
                var counter = 0;
                MM.getModules().withClass(modulesToEnumerate).enumerate(function (module) {


                    console.log("enumerating: " + counter);
                    if (action === "open") {
                        module.showPopUp();
                    }
                    else if (action === "close" || action === "clothes") {
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
                        var newConfig = Object.assign(module.config, payload.configs[counter])
                        module.restart(newConfig, function () {
                            //Module reloaded
                        });
                    }
                    counter += 1;
                });

            } else {
                console.log("no modules to enumerate")
            }

        }
        else if (notification === "HELLO_USER") {
            this.sendNotification("HELLO_USER", payload);
        }

    },
    
    hideContainer: function () {

        var x = document.getElementsByTagName("voice_container");

        //console.log("x")
        //console.log(x)

        this.hide();



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


