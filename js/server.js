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
var async = require("async");

var MongoClient = require('mongodb').MongoClient;
var mongoDB = null;
var config;
var currentUser = "default";

var Server = function(config, callback) {

	console.log("Starting server op port " + config.port + " ... ");

	connectToDB(config);

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


	if (typeof callback === "function") {
		callback(app, io);
	}
};


app.get('/getCurrentUser', function(req, res) {
	res.send( {currentUser: currentUser} );
});

app.get('/getDefaultUserFromDB/', function (req, res) {

	var the_result = [];

	async.series([

		function (callback) {


			var query = {"name": "default"};

			if (mongoDB != null) {
				mongoDB.collection("users").find(query).toArray(function (err, result) {
					if (err)
						throw err;
					else {
						//console.log("db result: "+ JSON.stringify(result));
						the_result = result;
					}
					callback()
				});
			}

		}
	], function (err) { //This function gets called after the two tasks have called their "task callbacks"
		if (err)
			return next(err);

		res.json(the_result);

	});


});

var connectToDB = function (config) {

	var server = "//localhost:27017";
	var dbName = "sen5or";

	MongoClient.connect('mongodb:'+server+'/'+dbName, function (err, db) {
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

						insertToDatabase(getDefaultUser(config), null);

					}
					else {

						//insertToDatabase(getDefaultUser(config), null);
						//insertToDatabase(newUser(config));

						console.log("Found users: " +result.length);
						return result;
					}
				}
			});

		}
	});

};



var insertToDatabase = function (jsonData, callback) {

	mongoDB.collection('users').insertOne(
		jsonData,
		function (err, result) {
			if(err){return err;}
			console.log("Inserted to DB");
		});
};

function getDefaultUser(config){

	var defaultUser = {
		"name"		: "default",
		language: 'en',
		timeFormat: 12,
		units: 'imperial',
		location: "San Diego",
		modules 	: [
			{
				module: 'clock',
				position: 'top_left'
			},
			{
				module: 'currentweather',
				position: 'top_right',
				config: {
					location: "San Diego",
					locationID: '5342353',  //ID from http://www.openweathermap.org  //5342353 - del mar
					appid: 'ff5b188249eab39338f5d1eb9e28922f'
				}
			},
			{
				module: 'newsfeed',
				position: 'bottom_center',
				config: {
					feeds: [
						{
							title: "New York Times",
							url: "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml"
						}
					],
					showSourceTitle: true,
					showPublishDate: true
				}
			},
			{
				module: 'compliments',
				position: 'lower_third'
			},
			{
				module: 'MMM-twitter',
				position: 'top_left',
				config: {
					query: {q: "UCSD OR 'berkeley'", count: 5},
				}
			},
			{
				module: 'gesture_control',
				position: 'bottom_right'
			},
			{
				module: 'voice_control',
				position: 'bottom_right'
			},
			{
				module: 'bluetooth_control',
				position: 'bottom_right'
			}
		]
	};

	return defaultUser

}



function newUser(config){

	var user = {
		name		: "isaac",
		language: 'en',
		timeFormat: 12,
		units: 'imperial',
		location: "del mar",
		modules 	: [
			{
				module: 'clock',
				position: 'top_left'
			},
			{
				module: 'currentweather',
				position: 'top_right',
				config: {
					location: "del mar",
					locationID: '5342353',  //ID from http://www.openweathermap.org  //5342353 - del mar
					appid: 'ff5b188249eab39338f5d1eb9e28922f'
				}
			},
			{
				module: 'newsfeed',
				position: 'bottom_center',
				config: {
					feeds: [
						{
							title: "BBC",
							url: "http://feeds.bbci.co.uk/news/video_and_audio/news_front_page/rss.xml?edition=uk",
						}
					],
					showSourceTitle: true,
					showPublishDate: true
				}
			},
			{
				module: 'compliments',
				position: 'lower_third'
			},
			{
				module: 'MMM-twitter',
				position: 'top_left',
				config: {
					query: {q: "'del mar' OR 'fashion'", count: 5},
				}
			},
			{
				module: 'gesture_control',
				position: 'bottom_right'
			},
			{
				module: 'voice_control',
				position: 'bottom_right'
			}
		]
	};

	return user;

}


module.exports = {
	"server" : Server
};


/**
 db.users.insert({
		name		: "isaac",
		language: 'en',
		timeFormat: 12,
		units: 'imperial',
		location: "del mar",
		modules 	: [
			{
				module: 'clock',
				position: 'top_left'
			},
			{
				module: 'currentweather',
				position: 'top_right',
				config: {
					location: "del mar",
					locationID: '5342353',  //ID from http://www.openweathermap.org  //5342353 - del mar
					appid: 'ff5b188249eab39338f5d1eb9e28922f'
				}
			},
			{
				module: 'newsfeed',
				position: 'bottom_center',
				config: {
					feeds: [
						{
                    		title: "BBC",
                    		url: "http://feeds.bbci.co.uk/news/video_and_audio/news_front_page/rss.xml?edition=uk",
                		}
					],
					showSourceTitle: true,
					showPublishDate: true
				}
			},
			{
				module: 'compliments',
				position: 'lower_third'
			},
			{
				module: 'MMM-twitter',
				position: 'top_left',
				config: {
					query: {q: "nhl OR 'drones'", count: 5},
				}
			},
			{
				module: 'gesture_control',
				position: 'bottom_right'
			},
			{
				module: 'voice_control',
				position: 'bottom_right'
			}
		]
	})




 */
