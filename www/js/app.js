// Ionic Starter App


var db = null;

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('myApp', ['ionic', 'ngCordova']).run(function($ionicPlatform, $cordovaSQLite) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        //db = $cordovaSQLite.openDB("face.db"); For android device
        db = window.openDatabase("face.db", "1.0", "Dev Database", 10000); //To test in web browser with ionic serve
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS word(id INTEGER PRIMARY KEY, frenchWord TEXT, englishWord TEXT, idSignLSF INTEGER, idSignASL INTEGER,FOREIGN KEY(idSignLSF) REFERENCES sign(id), FOREIGN KEY(idSignASL) REFERENCES sign(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS sign(id INTEGER PRIMARY KEY, language INTEGER, idVideo INTEGER, FOREIGN KEY(idVideo) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS configuration(id INTEGER PRIMARY KEY, language INTEGER, imageURL TEXT)");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS position(id INTEGER PRIMARY KEY, positionName TEXT)");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS wording(id INTEGER PRIMARY KEY, wordID INTEGER, videoID INTEGER, subtitleID INTEGER, FOREIGN KEY(wordID) REFERENCES word(id), FOREIGN KEY(videoID) REFERENCES video(id), FOREIGN KEY(subtitleID) REFERENCES subtitle(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS video(id INTEGER PRIMARY KEY, language INTEGER, videoID INTEGER, FOREIGN KEY(videoID) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS video(id INTEGER PRIMARY KEY, youtubeURL TEXT, localURL TEXT)");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS subtitle(id INTEGER PRIMARY KEY, timer DATE)");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS sentenceQCM(id INTEGER PRIMARY KEY, difficultyLevel INTEGER, sentence TEXT, videoIDALSF INTEGER,videoIDAASL INTEGER, videoIDBLSF INTEGER, videoIDBASL INTEGER, videoIDCLSF INTEGER, videoIDCASL INTEGER, videoIDDLSF INTEGER, videoIDDASL INTEGER,goodAnswer TEXT, FOREIGN KEY(videoIDALSF) REFERENCES video(id), FOREIGN KEY(videoIDAASL) REFERENCES video(id), FOREIGN KEY(videoIDBLSF) REFERENCES video(id), FOREIGN KEY(videoIDBASL) REFERENCES video(id), FOREIGN KEY(videoIDCLSF) REFERENCES video(id), FOREIGN KEY(videoIDCASL) REFERENCES video(id), FOREIGN KEY(videoIDDLSF) REFERENCES video(id), FOREIGN KEY(videoIDDASL) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS videoQCM(id INTEGER PRIMARY KEY, difficultyLevel INTEGER, videoIDLSF INTEGER, videoIDASL INTEGER,sentenceA TEXT, sentenceB TEXT, sentenceC TEXT, sentenceD TEXT, goodAnswer TEXT, FOREIGN KEY(videoIDLSF) REFERENCES video(id), FOREIGN KEY(videoIDASL) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS genealogy(id INTEGER PRIMARY KEY, wordID INTEGER, frenchDescription TEXT, englishDescrption TEXT, LSFDescription TEXT, ASLDescription TEXT, FOREIGN KEY (wordID) REFERENCES word(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS wordingWord(wordID INTEGER PRIMARY KEY, wordingID INTEGER PRIMARY KEY, FOREIGN KEY(wordID) REFERENCES word(id), FOREIGN KEY(wordingID) REFERENCES wording(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS LSFDialogueWord(wordID INTEGER PRIMARY KEY, dialogueID INTEGER PRIMARY KEY, FOREIGN KEY(wordID) REFERENCES word(id), FOREIGN KEY(dialogueID) REFERENCES dialogue(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS ASLDialogueWord(wordID INTEGER PRIMARY KEY, dialogueID INTEGER PRIMARY KEY, FOREIGN KEY(wordID) REFERENCES word(id), FOREIGN KEY(dialogueID) REFERENCES dialogue(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS positionConfigurationSign(signID INTEGER PRIMARY KEY, configurationID INTEGER PRIMARY KEY, positionID INTEGER PRIMARY KEY, FOREIGN KEY(signID) REFERENCES sign(id), FOREIGN KEY(configurationID) REFERENCES configuration(id), order INTEGER, FOREIGN KEY(positionID) REFERENCES position(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS subtitleDialogue(dialogueID INTEGER PRIMARY KEY, subtitleID INTEGER PRIMARY KEY, FOREIGN KEY(dialogueID) REFERENCES dialogue(id), FOREIGN KEY(subtitleID) REFERENCES subtitle(id))");
    });
});

app.controller("HomeCtrl", function($scope, $ionicLoading, $http, $cordovaSQLite) {

    var list = [{
        name: 'Max',
        age: '22'
    }, {
        name: 'Romain',
        age: '22'
    }]

    /* Requêtes de recherches dans la table word */
    $scope.searchFrenchWord = function(mot) {
        var query = "SELECT * FROM word WHERE frenchWord = ?";
        $cordovaSQLite.execute(db, query, [mot]).then(function(res) {
            if (res.rows.length > 0) {
                console.log("SELECTED -> " + res.rows.item(0));
            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    };

    $scope.searchEnglishWord = function(mot) {
        var query = "SELECT * FROM word WHERE englishWord = ?";
        $cordovaSQLite.execute(db, query, [mot]).then(function(res) {
            if (res.rows.length > 0) {
                console.log("SELECTED -> " + res.rows.item(0));
            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    };


    /* Requêtes de recherches dans la table video */
        $scope.searchVideo = function(videoID) {
        var query = "SELECT * FROM video WHERE id = ?";
        $cordovaSQLite.execute(db, query, [videoID]).then(function(res) {
            if (res.rows.length > 0) {
                console.log("SELECTED -> " + res.rows.item(0));
            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    };

    /* Requêtes de recherches dans la table configuration */
        $scope.searchConfiguration = function(configurationID, language) {
        var query = "SELECT * FROM configuration WHERE id = ? AND language = ?";
        $cordovaSQLite.execute(db, query, [configurationID, language]).then(function(res) {
            if (res.rows.length > 0) {
                console.log("SELECTED -> " + res.rows.item(0));
            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    };

    /* Requêtes de recherches dans la table wording */
        $scope.searchWordingsByWordID = function(wordID) {
        var query = "SELECT * FROM wording WHERE wordID = ?";
        $cordovaSQLite.execute(db, query, [wordID]).then(function(res) {
            if (res.rows.length > 0) {
                console.log("SELECTED -> " + res.rows.item(0));
            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    };

    $scope.insert = function(mot) {
        var query = "INSERT INTO word (mot) values(?)";
        $cordovaSQLite.execute(db, query, [mot]).then(function(res) {
            console.log("Word successfully added -> " + res.insertId);
        }, function(err) {
            console.error(err);
        });
    }

    $scope.delete = function(mot) {
        var query = "DELETE FROM word where mot = ?";
        $cordovaSQLite.execute(db, query, [mot]).then(function(res) {
            console.log("Successful delete " + res);
        }, function(err) {
            console.error(err);
        });
    }

    $scope.insert("Romain");
    $scope.delete("Romain");

});

app.controller("LSFSearch", function($scope, $ionicLoading, $http) {

    $scope.images = [];

    /*Ici on chargera les images de la base de données pour affichée la grille des signes*/
    $scope.loadImages = function() {
        for (var i = 0; i < 48; i++) {
            $scope.images.push({
                src: "http://"
            });
        };
    }

});


app.controller("ASLSearch", function($scope, $ionicLoading, $http) {

    $scope.images = [];

    /*Ici on chargera les images de la base de données pour affichée la grille des signes*/
    $scope.loadImages = function() {
        for (var i = 0; i < 48; i++) {
            $scope.images.push({
                src: "http://"
            });
        };
    }

});

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
    })

    $stateProvider.state('lsf-search', {
        url: '/lsf-search',
        templateUrl: 'templates/lsf-search.html',
        controller: 'LSFSearch'
    })

    $stateProvider.state('fr-search', {
        url: '/fr-search',
        templateUrl: 'templates/fr-search.html',
        // controller: 'HomeCtrl'
    })

    $stateProvider.state('asl-search', {
        url: '/asl-search',
        templateUrl: 'templates/asl-search.html',
        controller: 'ASLSearch'
    })

    $stateProvider.state('en-search', {
        url: '/en-search',
        templateUrl: 'templates/en-search.html'
            // controller: 'HomeCtrl'
    })
    $urlRouterProvider.otherwise('/home')

});
