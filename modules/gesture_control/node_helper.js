
var NodeHelper = require("node_helper");
var WebSocket = require('ws');
var MongoClient = require('mongodb').MongoClient;
var mongoDB = null;

var userName = "";
var child;
var exec;
var socketServer;

module.exports = NodeHelper.create({
	
	start: function() {
		console.log("Starting module: " + this.name);
		
	},
	
	socketNotificationReceived: function(notification, payload) {
		
		console.log("Notification: " + notification + " Payload: " + payload);



		if(notification === "START_GESTURE_STREAM"){

            if(socketServer != null){
                this.sendSocketNotification("WEB_SOCKET_CONNECTED", null);
            }
            else{

				//is a camera available?
				var fs = require('fs');
				var path = "/dev/video0";

				try {
					fs.accessSync(path, fs.F_OK);
					console.log("found device to use!");
					this.startGestureStream(payload.config);
				} catch (e) {
					console.log("no accessible camera found")
				}

			}
		}
		
	},

	startGestureStream: function(config){


		var self = this;

		/*
		var STREAM_SECRET = "yourpassword";
		var STREAM_PORT = 8082,
			WEBSOCKET_PORT = 8084,
			STREAM_MAGIC_BYTES = 'jsmp';

		var width = 320,
			height = 240;

		// Websocket Server
		socketServer = new (require('ws').Server)({port: WEBSOCKET_PORT});
		socketServer.on('connection', function(socket) {
			// Send magic bytes and video size to the newly connected socket
			// struct { char magic[4]; unsigned short width, height;}
			var streamHeader = new Buffer(8);
			streamHeader.write(STREAM_MAGIC_BYTES);
			streamHeader.writeUInt16BE(width, 4);
			streamHeader.writeUInt16BE(height, 6);
			socket.send(streamHeader, {binary:true});

			console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );

			socket.on('close', function(code, message){
				console.log( 'Disconnected WebSocket ('+socketServer.clients.length+' total)' );
			});
		});

		socketServer.broadcast = function(data, opts) {
			for( var i in this.clients ) {
				if (this.clients[i].readyState == 1) {
					this.clients[i].send(data, opts);
				}
				else {
					console.log( 'Error: Client ('+i+') not connected.' );
				}
			}
		};


		// HTTP Server to accept incomming MPEG Stream
		var streamServer = require('http').createServer( function(request, response) {
			var params = request.url.substr(1).split('/');

			if( params[0] == STREAM_SECRET ) {
				response.connection.setTimeout(0);

				width = (params[1] || 320)|0;
				height = (params[2] || 240)|0;

				console.log(
					'Stream Connected: ' + request.socket.remoteAddress +
					':' + request.socket.remotePort + ' size: ' + width + 'x' + height
				);
				request.on('data', function(data){
					socketServer.broadcast(data, {binary:true});
				});
			}
			else {
				console.log(
					'Failed Stream Connection: '+ request.socket.remoteAddress +
					request.socket.remotePort + ' - wrong secret.'
				);
				response.end();
			}
		}).listen(STREAM_PORT);

		console.log('Listening for MPEG Stream on http://127.0.0.1:'+STREAM_PORT+'/<secret>/<width>/<height>');
		console.log('Awaiting WebSocket connections on ws://127.0.0.1:'+WEBSOCKET_PORT+'/');
*/



		//TODO


		var util = require('util'),
			spawn = require('child_process').spawn,
			py = spawn('python', ['./modules/gesture_control/face_recognize.py']);

		py.stdout.on('data', function (data) {

			//console.log("FR stdout: " + data.toString());

			var rawInput = data.toString().replace(/(\r\n|\n|\r)/gm, "");
			rawInput = rawInput.toLowerCase();

			if(!rawInput.localeCompare(self.userName)){
				//console.log("same use found. not changing")
			}else{

				self.sendSocketNotification("HELLO_USER", data.toString());
				self.userName = data.toString().toLowerCase();
				self.userName = self.userName.replace(/(\r\n|\n|\r)/gm, "");

				queryDbForUser()
			}



		});

		py.stderr.on('data', function (data) {
			//console.log('stderr: ' + data.toString());
		});

		py.on('exit', function (code) {
			console.log('child process exited with code ' + code.toString());
		});






		/*

		exec = require('child_process').exec, child;
		var shellCommand = 'ffmpeg -s 320x240 -i /dev/video0 -vf "hflip" -f mpeg1video -b 800k -r 30 http://localhost:8082/yourpassword/320/240/';

		child = function () {
			exec(shellCommand,
				function (error, stdout, stderr) {
					console.log('stdout: ' + stdout);
					console.log('stderr: ' + stderr);
					if (error !== null) {
						console.log('exec error: ' + error);
					}
				});
		};

		child();*/

        //self.sendSocketNotification("WEB_SOCKET_CONNECTED", null);


		function queryDbForUser() {


			if (mongoDB === null) {
				connectToDB(getUserInfo);

			}
			else {
				getUserInfo()
			}


			function connectToDB(callback) {
				MongoClient.connect('mongodb://localhost:27017/sen5or', function (err, db) {
					if (err) {
						console.log("Error connecting to mongodb");
						throw err;
					}

					else {
						console.log("Connected to DB ....");
						mongoDB = db;

						callback();
					}
				});
			}


			function getUserInfo() {
				console.log("checking DB for: " + self.userName);
				mongoDB.collection('users').find({"name": self.userName}).toArray(function (err, result) {
					if (err)
						throw err;
					else {

						if (result.length == 0) {
							console.log("User " + self.userName + " does not exist");
							//return null;
						}
						else {

							var module_list = result[0].modules;

							var modules_obj = getModuleNames(module_list)

							//return module_list;
							var jsonCommand = {
								"action": "restart",
								"modules": modules_obj.moduleNames,
								"configs": modules_obj.configs
							};

							self.sendCommandToFrontEnd(jsonCommand);

						}
					}
				});
			}


			function getModuleNames(module_list) {

				if (module_list.length > 0) {                     //user modules were found, lets try to pass new configs, and restart modules

					var moduleNames = [];
					var configs = [];
					//get module class names
					for (var index in module_list) {
						//console.log("module: " + JSON.stringify(module_list[index]))

						// add modules that have configs attached to them
						if (module_list[index].config != undefined) {

							configs.push(module_list[index].config);
							moduleNames.push(module_list[index].module)
						}
					}

					return {
						moduleNames: moduleNames,
						configs: configs
					}
				}
			}

		}



	},
	sendCommandToFrontEnd: function (jsonCommand) {

		console.log("sending command: " + JSON.stringify(jsonCommand));
		this.sendSocketNotification("FACE_COMMAND", jsonCommand);

	}



});
