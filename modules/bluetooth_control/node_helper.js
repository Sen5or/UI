var NodeHelper = require("node_helper");

var child;

var screenStatus = false;

module.exports = NodeHelper.create({



    start: function () {
        console.log("Starting module: " + this.name);
        var self = this;

        this.expressApp.post('/ScreenOn', function (req, res) {
            //console.log("Received ScreenOn from android!!");
            self.doScreenStatusUpdate(true);
            res.send('success');
        });

        this.expressApp.post('/ScreenOff', function (req, res) {
            //console.log("Received ScreenOff from android!!");
            self.doScreenStatusUpdate(false);
            res.send('success');
        });

    },

    socketNotificationReceived: function (notification, payload) {

        console.log("Notification: " + notification + " Payload: " + payload);

        if (notification === "START_BLUETOOTH_LISTENER") {
        }

    },

    doScreenStatusUpdate: function (freshStatus) {


        if (!screenStatus && freshStatus) {                               //Screen is off, but turn on is recieved
            //Turn on screen
            console.log("Received ScreenOn from android!!");
            var exec = require('child_process').exec, child;
            child = exec('./modules/bluetooth_control/TurnOnScreen.sh',
                function (error, stdout, stderr) {

                });

            screenStatus = freshStatus;
        }
        else if (screenStatus && !freshStatus) {                          //Screen is on, but turn off is recieved
            console.log("Received ScreenOff from android!!");
            //Turn off screen
            var exec = require('child_process').exec, child;
            child = exec('./modules/bluetooth_control/TurnOffScreen.sh',
                function (error, stdout, stderr) {

                });

            screenStatus = freshStatus;
        }
    }


});
