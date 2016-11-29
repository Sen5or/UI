var NodeHelper = require("node_helper");
var MongoClient = require('mongodb').MongoClient;
var mongoDB = null;


module.exports = NodeHelper.create({


    start: function () {
        console.log("Starting module: " + this.name);
        this.currentUser = ""

    },

    socketNotificationReceived: function (notification, payload) {

        console.log("Notification: " + notification + " Payload: " + payload);

        if (notification === "START_VOICE_CONTROL") {

            this.startVoiceScript(payload);
        }

    },

    startVoiceScript: function (config) {


        console.log(config);
        this.currentUser = config.currentUser;

        var self = this;
        var rawCommandOld = "";
        var rawCommandNew = "";
        var command = "";

        var util = require('util'),
            spawn = require('child_process').spawn,
            py = spawn('python3', ['./modules/voice_control/Record.py']);

        py.stdout.on('data', function (data) {
            console.log("stdout: " + data.toString());
            rawCommandNew = data.toString().toLowerCase();

            if (rawCommandNew.localeCompare("") && rawCommandOld.localeCompare(rawCommandNew)) {
                rawCommandOld = rawCommandNew;
                command = rawCommandOld.replace(/(\r\n|\n|\r)/gm, "");
                var words = command.split(" ");
                self.analyzeVoiceCommand(words);
            }


        });

        py.stderr.on('data', function (data) {
            //console.log('stderr: ' + data.toString());
        });

        py.on('exit', function (code) {
            console.log('child process exited with code ' + code.toString());
        });



         setTimeout(function () {
         console.log("currentUser from main: "+ self.currentUser);

         self.analyzeVoiceCommand(["user:deagan"]);
         },5000);



        this.sendSocketNotification("VOICE_SCRIPT_STARTED", null);

    },

    analyzeVoiceCommand: function (words) {


        console.log('wordsArray: ' + words);

        var self = this;


        /** check to see if command should be run as a certain user **/

        var indexOfAs = words.indexOf("as");

        if (words.indexOf("as") > -1) {

            if (words.length > (indexOfAs + 1)) {

                var userName = words[indexOfAs + 1];
                queryDbForUser(userName)

            }

        }
        else if (words[0].startsWith("user:")) {

            var userName = words[0].replace("user:", '');

            this.sendSocketNotification("HELLO_USER", userName);

            queryDbForUser(userName)

        }

        /** check for action and module, then send command to front end **/

        else if (isActionWord(words[0])) {                        //Action

            var modName = isModule(words[1]);
            //TODOD

            if (modName != null) {                                //Module name to perform action on

                var jsonCommand = {
                    "action": words[0],
                    "modName": modName
                };

                this.sendCommandToFrontEnd(jsonCommand);


            }
            else {
                console.log("Module '" + words[1] + "' is missing")
            }

        }
        else {
            console.log("Action '" + words[0] + "' is not recognized")
        }


        function isActionWord(word) {

            if (word === "open") {
                return true;
            }
            else if (word === "hide" || word == "hyde") {
                return true;
            }
            else if (word === "show") {
                return true;
            }
            else if (word === "close" || word === "clothes") {
                return true;
            }
            else if (word === "move") {
                return true;
            }
            else if (word.localeCompare("sleep")) {
                //sleep 1; xset dpms force off
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
                console.log("checking DB for: " + userName);
                mongoDB.collection('users').find({"name": userName}).toArray(function (err, result) {
                    if (err)
                        throw err;
                    else {

                        if (result.length == 0) {
                            console.log("User " + userName + " does not exist");
                            //return null;
                        }
                        else {
                            console.log("Found user: " + JSON.stringify(result[0].name));
                            console.log(result[0]);


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
                //console.log("checking modules for matches");

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
                        moduleNames : moduleNames,
                        configs : configs
                    }
                }
            }


        }


        //testing
        var userInfo = {
            "name": "user1",
            "location": "new york",
            "language": config.language,
            "timeFormat": 24,
            "units": config.units,
            "modules": [
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
                        query: {q: "gamer OR 'new york'", count: 5}
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
                    if (err) {
                        return err;
                    }
                    console.log("Inserted to DB");
                    //callback();
                });
        };


    },

    sendCommandToFrontEnd: function (jsonCommand) {

        console.log("sending command: " + JSON.stringify(jsonCommand));
        this.sendSocketNotification("VOICE_COMMAND", jsonCommand);

    }


});
