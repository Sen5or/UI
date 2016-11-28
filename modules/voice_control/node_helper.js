
var NodeHelper = require("node_helper");

var MongoClient = require('mongodb').MongoClient;

var mongoDB = null;

module.exports = NodeHelper.create({



	start: function() {
		console.log("Starting module: " + this.name);
	},
	
	socketNotificationReceived: function(notification, payload) {
		
		console.log("Notification: " + notification + " Payload: " + payload);
		
		if(notification === "START_VOICE_CONTROL"){

            this.startVoiceScript(payload.config);
		}
		
	},

	startVoiceScript: function(config){



/*
        var self = this;

        // TODO this will recieve voice commands and perform operations
		var spawn = require('child_process').spawn,
			py    = spawn('python',['./modules/voice_control/Record.py']);

		py.stdout.on('data', function (data) {
			console.log('STDOUT: ' + data);
		});
		py.stderr.on('data', function (data) {
			console.log('stderr: ' + data);
		});
*/

        var util    = require('util'),
            spawn   = require('child_process').spawn,
            //ls    = spawn('ls', ['-lh', '/usr']);
            py      = spawn('python',['./modules/voice_control/Record.py']);

        py.stdout.on('data', function (data) {
            console.log('stdout: ' + data.toString());
        });

        py.stderr.on('data', function (data) {
            //console.log('stderr: ' + data.toString());
        });

        py.on('exit', function (code) {
            console.log('child process exited with code ' + code.toString());
        });


        this.sendSocketNotification("VOICE_SCRIPT_STARTED", null);


		/**Catch voice commands here**/




        //var command = "show weather as user1";

        //command = "hide weather";
/*
        setTimeout(function(){
            self.analyzeVoiceCommand(command);
            //command = "show weather";
        }, 4000);
*/
/*
        setTimeout(function(){
            self.analyzeVoiceCommand(command);
        }, 4000);
*/


	},

    analyzeVoiceCommand: function (command) {


        var self = this;
        var words = command.split(" ");


        if(words.length < 2) {
            return
        }



        /** check to see if command should be run as a certain user **/

        var indexOfAs = words.indexOf("as");

        if(words.indexOf("as") > -1){

                if(words.length > (indexOfAs+1)){

                    var userName = words[indexOfAs+1];
                    console.log("checking username: "+userName );
                    queryDbForUser(userName)

                }

        }


        /** check for action and module, then send command to front end **/

        else if(isActionWord(words[0])){                        //Action

            var modName = isModule(words[1]);
            if(modName != null){                                //Module name to perform action on

                var jsonCommand = {
                    "action" : words[0],
                    "modules" : modName
                };

                this.sendCommandToFrontEnd(jsonCommand);


            }
            else{
                console.log("Module '"+words[1]+"' is not recognized")
            }

        }
        else{
            console.log("Action '"+words[0]+"' is not recognized")
        }



        function isActionWord(word) {

            if(word === "open"){
                return true;
            }
            else if(word === "hide"){
                return true;
            }
            else if(word === "show"){
                return true;
            }
            else if(word === "close"){
                return true;
            }
            else if(word === "move"){
                return true;
            }
            else
                return false;
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

        function queryDbForUser(userName) {


            if (mongoDB === null){
                connectToDB(getUserInfo);

            }
            else{
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
                        //insertToDatabase( userInfo, null);
                        callback();
                    }
                });
            }


            function testFunc(input) {
                console.log("in callback func: "+input)
            }

            function getUserInfo() {
                console.log("checking DB for: "+userName);
                mongoDB.collection('users').find({"name" : userName}).toArray(function (err, result) {
                    if (err)
                        throw err;
                    else {

                        if (result.length == 0) {
                            console.log("User "+userName+ " does not exist");
                        }
                        else {
                            console.log("Found user: " +JSON.stringify(result[0].name));
                            var module_list = result[0].modules;
                            checkModules(module_list)
                        }
                    }
                });
            }

            function checkModules(module_list) {
                console.log("checking modules for matches");

                if(module_list.length > 0){                     //user modules were found, lets try to pass new configs, and restart modules

                    var moduleNames = [];
                    var configs = []
                    //get module class names
                    for (var index in module_list) {
                        console.log("module: "+ JSON.stringify(module_list[index]))

                        // add modules that have configs attached to them
                        if(module_list[index].config != undefined){

                            configs.push(module_list[index].config);
                            //configs[index] = module_list[index].config;
                            //moduleNames[index] = module_list[index].module;
                            moduleNames.push(module_list[index].module)
                        }


                    }

                    //Here we have a list of modules that the user has saved. We will need to pass config files
                    //to the modules and restart them with the new configs

                    if (isActionWord(words[0])) {

                        var jsonCommand = {
                            "action": "restart",
                            "modules": moduleNames,
                            "configs": configs
                        };

                        self.sendCommandToFrontEnd(jsonCommand);


                    }
                    else {
                        console.log("Action '" + words[0] + "' is not recognized")
                    }


                }


            }




        }


        //testing
        var userInfo = {
            "name"		: "user1",
            "location"  : "new york",
            "language"  : config.language,
            "timeFormat": 24,
            "units" 	: config.units,
            "modules" 	: [
                {
                    module: 'currentweather',
                    position: 'top_right',
                    config: {
                        location: 'La jolla',
                        locationID: '5342353',  //ID from http://www.openweathermap.org  //5342353 - del mar
                        appid: 'ff5b188249eab39338f5d1eb9e28922f'
                    }
                },
                {
                    module: 'MMM-twitter',
                    position: 'top_right',
                    config: {
                        maxNumTweets: 5,
                        query: {q: "gamer OR 'new york'", count: 5 }
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




    },

    sendCommandToFrontEnd: function(jsonCommand){

        console.log("sending command: " + JSON.stringify(jsonCommand));
        this.sendSocketNotification("VOICE_COMMAND", jsonCommand);

    }


});
