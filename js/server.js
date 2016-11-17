/* Magic Mirror
 * Server
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var express = require("express");
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var path = require("path");

var screenWidth = -1;

var Server = function(config, callback) {
	self = this;
	console.log("Starting server op port " + config.port + " ... ");






	server.listen(config.port);
	app.use("/js", express.static(__dirname));
	app.use("/config", express.static(path.resolve(__dirname + "/../config")));
	app.use("/css", express.static(path.resolve(__dirname + "/../css")));
	app.use("/fonts", express.static(path.resolve(__dirname + "/../fonts")));
	app.use("/modules", express.static(path.resolve(__dirname + "/../modules")));
	app.use("/vendor", express.static(path.resolve(__dirname + "/../vendor")));
	app.use("/translations", express.static(path.resolve(__dirname + "/../translations")));

	app.get("/", function(req, res) {
		res.sendFile(path.resolve(__dirname + "/../index.html"));
	});


	app.get('/startGesture', function (req, res) {

		var exec = require('child_process').exec, child;

		var child = function () {
			exec('python ./python/handHaar.py',
				function (error, stdout, stderr) {
					console.log('stdout: ' + stdout);
					console.log('stderr: ' + stderr);
					if (error !== null) {
						console.log('exec error: ' + error);
					}
				});
		};

		child();

	});



	if (typeof callback === "function") {
		callback(app, io);
	}
};


///users/:userId/books/:bookId
app.post('/screen_res/:width/:height', function(req, res) {
	console.log('hitting screen_req: '+JSON.stringify(req.params));
	//TODO set screen
	self.screenWidth = req.params.width;

});


module.exports = {
	'Server': Server,
	'screenWidth' : screenWidth };

