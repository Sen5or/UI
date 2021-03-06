/**
 * App.js
 */


var fs = require("fs");
var Server = require(__dirname + "/server.js").server;
var defaultModules = require(__dirname + "/../modules/default/defaultmodules.js");
var path = require("path");

// The next part is here to prevent a major exception when there
// is no internet connection. This could probable be solved better.
process.on("uncaughtException", function (err) {
    console.log("Whoops! There was an uncaught exception...");
    console.error(err);
    console.log("MagicMirror will not quit, but it might be a good idea to check why this happened. Maybe no internet connection?");
});

/* App - The core app.
 */
var App = function () {

    var modules = [];
    var nodeHelpers = [];

    var MongoClient = require('mongodb').MongoClient;
    var mongoDB = null;

    /* loadConfig(callback)
     * Loads the config file. combines it with the defaults,
     * and runs the callback with the found config as argument.
     *
     * argument callback function - The callback function.
     */


    //This happens first
    var loadConfig = function (callback) {
        console.log("Loading config ...");

        var defaults = require(__dirname + "/defaults.js");
        var configFilename = path.resolve(__dirname + "/../config/config.js");
        try {
            fs.accessSync(configFilename, fs.F_OK);
            var c = require(configFilename);
            var config = Object.assign(defaults, c);

            callback(config);
        } catch (e) {
            if (e.code == "ENOENT") {
                console.error("WARNING! Could not find config file. Please create one. Starting with default configuration.");
                callback(defaults);
            } else if (e instanceof ReferenceError || e instanceof SyntaxError) {
                console.error("WARNING! Could not validate config file. Please correct syntax errors. Starting with default configuration.");
                callback(defaults);
            } else {
                console.error("WARNING! Could not load config file. Starting with default configuration. Error found: " + e);
                callback(defaults);
            }
        }
    };

    /* loadModule(module)
     * Loads a specific module.
     *
     * argument module string - The name of the module (including subpath).
     */
    var loadModule = function (module) {

        var elements = module.split("/");
        var moduleName = elements[elements.length - 1];
        var moduleFolder = __dirname + "/../modules/" + module;

        if (defaultModules.indexOf(moduleName) !== -1) {
            moduleFolder = __dirname + "/../modules/default/" + module;
        }

        var helperPath = moduleFolder + "/node_helper.js";

        var loadModule = true;
        try {
            fs.accessSync(helperPath, fs.R_OK);
        } catch (e) {
            loadModule = false;
            console.log("No helper found for module: " + moduleName + ".");
        }

        if (loadModule) {
            var Module = require(helperPath);
            var m = new Module();
            m.setName(moduleName);
            m.setPath(path.resolve(moduleFolder));
            nodeHelpers.push(m);
        }


    };

    /* loadModules(modules)
     * Loads all modules.
     *
     * argument module string - The name of the module (including subpath).
     */
    var loadModules = function (modules) {
        console.log("Loading module helpers ...");

        for (var m in modules) {
            loadModule(modules[m]);
        }

        console.log("All module helpers loaded.");
    };

    /* start(callback)
     * This methods starts the core app.
     * It loads the config, then it loads all modules.
     * When it"s done it executes the callback with the config as argument.
     *
     * argument callback function - The callback function.
     */
    this.start = function (callback) {

        loadConfig(function (c) {
            this.config = c;

            connectToDB(function () {
                    var server = new Server(this.config, function (app, io) {
                        console.log("Server started ...");

                        for (var h in nodeHelpers) {
                            var nodeHelper = nodeHelpers[h];
                            nodeHelper.setExpressApp(app);
                            nodeHelper.setSocketIO(io);
                            nodeHelper.start();
                        }

                        console.log("Sockets connected & modules started ...");


                        //console.log("FINAL CONFIG: " + JSON.stringify(this.config));

                        if (typeof callback === "function") {
                            callback(this.config);
                        }

                    })
                }
            );

        });

    };


    function connectToDB(callback) {
        MongoClient.connect('mongodb://localhost:27017/sen5or', function (err, db) {
            if (err) {
                console.log("Error connecting to mongodb");
                throw err;
            }

            else {
                console.log("Connected to DB ....");
                mongoDB = db;
                getUserInfo(callback);
            }
        });
    }

    function getUserInfo(callback) {
        var self = this;
        var userName = "default";

        console.log("checking DB for: " + userName);

        mongoDB.collection('users').find({"name": userName}).toArray(function (err, result) {
            if (err)
                throw err;
            else {

                self.config = Object.assign(config, result[0])

                //this will be a list of modules parsed from config
                for (var m in self.config.modules) {
                    var module = self.config.modules[m];
                    if (modules.indexOf(module.module) === -1) {
                        modules.push(module.module);
                    }
                }

                //load modules
                loadModules(modules);


                if (typeof callback === "function") {
                    callback()
                } else {
                    console.log("cannot execute callback")
                }

            }
        });
    }


};

module.exports = new App();
