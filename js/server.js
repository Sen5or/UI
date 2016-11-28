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

var currentUser = "Default";

var Server = function(config, callback) {


	console.log("Starting server op port " + config.port + " ... ");

	connectToDB();

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




	/*
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
	*/



	if (typeof callback === "function") {
		callback(app, io);
	}
};







app.get('/getUserFromDB/:query', function(req, res) {

	console.log(req.params);

	var the_result = [];

	async.series([


		function(callback) {

			//console.log("userName: "+userName);
			console.log("query:");
			console.log(req.params.query);
			console.log(req.query);

			mongoDB.collection("users").find(req.query).toArray(function (err, result) {
				if (err)
					throw err;
				else {
					console.log("db result: "+result);
					the_result = result;
				}
				callback();
			});

		},
		/*
		function(callback) {
			db.query('posts', {userId: userId}, function(err, posts) {
				if (err) return callback(err);
				locals.posts = posts;
				callback();
			});
		}*/
	], function(err) { //This function gets called after the two tasks have called their "task callbacks"
		if (err) return next(err);

		console.log("the_result: "+the_result);
		res.json(the_result);
		//res.render('user-profile', result);
	});


});

app.get('/getCurrentUser', function(req, res) {
	res.send(currentUser);
});


app.get('/getCurrentUserFromDB', function(req, res) {

	var the_result = [];

	async.series([

		function(callback) {

			console.log("getting current user info from DB: "+currentUser);
			var query = { "name" : currentUser };

			if(mongoDB != null){
				mongoDB.collection("users").find(query).toArray(function (err, result) {
					if (err)
						throw err;
					else {
						console.log("db result: "+result);
						the_result = result;
					}
					callback();
				});
			}

		}
	], function(err) { //This function gets called after the two tasks have called their "task callbacks"
		if (err) return next(err);

		console.log("currentUser the_result: "+the_result);
		res.json(the_result);
	});


});

var connectToDB = function () {


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
								"name"		: "Default",
								"location"  : config.location,
								"language"  : config.language,
								"timeFormat": config.timeFormat,
								"units" 	: config.units,
								"modules" 	: config.modules

							}, null);
					}
					else {
						console.log("Found users: " +result.length);
					}
				}
			});

		}
	});

	//console.log("MongoClient: "+MongoClient)

};

//{$or:[{"by":"tutorials point"},{"title": "MongoDB Overview"}]}
app.get('/getUserFromDB', function(req, res) {

    var the_result = [];

    async.series([

        function(callback) {

            console.log("in getUserFromDB: "+req)
            console.log("in getUserFromDB: "+req.data)
            console.log("in getUserFromDB: "+req.url)
            console.log("in getUserFromDB: "+req.query)

            /*
            console.log("getting user info from DB: "+currentUser);
            var query = { "name" : currentUser };

            mongoDB.collection("users").find(query).toArray(function (err, result) {
                if (err)
                    throw err;
                else {
                    console.log("db result: "+result);
                    the_result = result;
                }
                callback();
            });*/

        }
    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) return next(err);

        console.log("currentUser the_result: "+the_result);
        res.json(the_result);
    });


});




//QUERY - db.user.find({"name":"jim john"})

var insertToDatabase = function (jsonData, callback) {

	mongoDB.collection('users').insertOne(
		jsonData,
		function (err, result) {
			//assert.equal(err, null);
			if(err){return err;}
			console.log("Inserted to DB");
			//callback();
		});
};


/*
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
*/

module.exports = {
	"server" : Server,
	"mongoDB" : mongoDB,
	//"mongo" : MongoClient
};



