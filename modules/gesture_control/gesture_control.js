

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
    }

});


var client = null;
var player;
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



var showIcon = function() {

	var image = document.getElementById("gesture_image");
	image.style.opacity = "0.9";
	image.style.filter  = 'alpha(opacity=90)'; // IE fallback

};

var hideIcon = function() {

	var image = document.getElementById("gesture_image");
	//image.style.opacity = "0.0";
	//image.style.filter  = 'alpha(opacity=0)'; // IE fallback

	fadeOut(image);

};


function fadeOut(element) {
	var op = 1;  // initial opacity
	var timer = setInterval(function () {
		if (op <= 0.1){
			clearInterval(timer);
		}
		if(element.style != null){
			element.style.opacity = op;
			element.style.filter = 'alpha(opacity=' + op * 100 + ")";
			op -= op * 0.1;
		}

	}, 20);
}


function fadeIn(element) {
	var op = 0.1;  // initial opacity
	if (element.style != null) {
		element.style.display = 'block';
		var timer = setInterval(function () {
			if (op >= .9){
				clearInterval(timer);
			}
			element.style.opacity = op;
			element.style.filter = 'alpha(opacity=' + op * 100 + ")";
			op += op * 0.1;
		}, 10);

	}

}


