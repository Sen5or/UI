

Module.register("gesture_control",{


	// Override dom generator.
	getDom: function() {

		var container = document.createElement("container_test");
		container.id = "gesture_container";

		var image = document.createElement("img");
		image.id = "gesture_image";
		image.src = "/modules/gesture_control/ic_pan_tool_white_36dp_1x.png";
		image.style.opacity = "0.0";
		image.style.filter  = 'alpha(opacity=0)'; // IE fallback

		container.appendChild(image);

		return container;

	},


	// Override start method.
	start: function() {
		Log.log("Starting module: " + this.name);

		Log.log("Calling python script ");

		/*
		$.ajax({
			url: "/modules/gesture_control/handHaar.py",
			success: function(response) {
				Log.log("success: "+response);
			},
			error: function(response) {
				Log.log("error: "+response);
			}
		});*/

	}

});


/*
$.ajax({
	url: "/path/to/your/script",
	success: function(response) {
		// here you do whatever you want with the response variable
	}
});*/


var timeout;
document.onmousemove = function(){
	showIcon();
	clearTimeout(timeout);
	timeout = setTimeout(function(){
		hideIcon();
	}, 1000);
};




var showIcon = function() {

	var image = document.getElementById("gesture_image");
	image.style.opacity = "0.9";
	image.style.filter  = 'alpha(opacity=90)'; // IE fallback

	//fadeIn(image);
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


