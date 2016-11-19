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

var MongoClient = require('mongodb').MongoClient;


var mongoDB = null;

var Server = function(config, callback) {


	console.log("Starting server op port " + config.port + " ... ");


	setupDB();


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

	app.get("/testDB", function(req, res) {
		console.log("in query DB get: "+req);
		console.log("in query DB get: "+JSON.stringify(req["params"]));
		console.log("in query DB get: "+JSON.stringify(req["data"]));
		console.log("in query DB get: "+JSON.stringify(req.data));
		console.log("in query DB get: "+JSON.stringify(req.params));
		console.log("in query DB get: "+JSON.stringify(req.body));
		res.status(status).send(body);
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



var setupDB = function () {


	MongoClient.connect('mongodb://localhost:27017/sen5or', function (err, db) {
		if (err) {
			console.log("Error connecting to mongodb");
			throw err;
		}

		else {
			console.log("Connected to DB ....");

			mongoDB = db;
			mongoDB.collection('users').find().toArray(function (err, result) {
				if (err)
					throw err;
				else {
					//Add default user if db is empty
					if (result.length == 0) {

						insertToDatabase(
							{
								"name": "default",
								"weather_city": "La jolla"
							}, null);
					}
					else {
						console.log("DB contents: " + JSON.stringify(result));
					}
				}
			});

		}
	});

	//console.log("MongoClient: "+MongoClient)

};



//QUERY - db.user.find({"name":"jim john"})

var insertToDatabase = function (jsonData, callback) {


	mongoDB.collection('sen5or').insertOne(
		jsonData,
		function (err, result) {
			assert.equal(err, null);
			console.log("Inserted a document into the restaurants collection.");
			callback();
		});
};


//{$or:[{"by":"tutorials point"},{"title": "MongoDB Overview"}]}
var queryDatabase = function (db, tableName, query) {

	console.log("tableName: "+tableName)
	mongoDB.collection(tableName).find().toArray(function (err, result) {
		if (err)
			throw err;
		else {
			console.log("db: "+result)
			return result;
		}
	})

};

app.post('/queryDatabase', function(req, res) {
	console.log("in query DB post: "+JSON.stringify(req["params"]));
	console.log("in query DB post: "+JSON.stringify(req["data"]));
	console.log("in query DB post: "+JSON.stringify(req.data));
	console.log("in query DB post: "+JSON.stringify(req.params));
	console.log("in query DB post: "+JSON.stringify(req.body));
	return queryDatabase(req.params.table, req.params.params);
});

app.get('/queryDatabase', function(req, res) {
	console.log("in query DB get1: "+req);
	console.log("in query DB get1: "+JSON.stringify(req["params"]));
	console.log("in query DB get1: "+JSON.stringify(req["data"]));
	console.log("in query DB get1: "+JSON.stringify(req.data));
	console.log("in query DB get1: "+JSON.stringify(req.params));
	console.log("in query DB get1: "+JSON.stringify(req.body));
	return queryDatabase(req.params.tableName, req.params.query);
});

app.get('/queryDatabase/:tableName/:query', function(req, res) {
	console.log("in query DB get: "+JSON.stringify(req["params"]));
	console.log("in query DB get: "+JSON.stringify(req.data));
	console.log("in query DB get: "+JSON.stringify(req.params.query));
	console.log("in query DB get: "+JSON.stringify(req.body));
	var result = queryDatabase(req.params.tableName, req.params.query);
	console.log("result: "+ result);
	return result;
});

///users/:userId/books/:bookId
app.post('/screen_res/:width/:height', function(req, res) {
	console.log('hitting screen_req: '+JSON.stringify(req.params));


});


app.post('/test', function(req, res) {
	console.log("in test DB get: "+req);
	console.log("in test DB get: "+JSON.stringify(req["params"]));
	console.log("in test DB get: "+JSON.stringify(req["data"]));
	console.log("in test DB get: "+JSON.stringify(req.data));
	console.log("in test DB get: "+JSON.stringify(req.params));
	console.log("in test DB get: "+JSON.stringify(req.body));
	res.status(status).send(body)
});


module.exports = {
	"server" : Server,
	"db" : mongoDB,
	"mongo" : MongoClient
};



