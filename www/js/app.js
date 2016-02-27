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

        if (window.cordova && window.SQLitePlugin) {
            db = $cordovaSQLite.openDB('face.db', 1); // Android devices
            db.executeSql("PRAGMA foreign_keys=ON;")
        } else
            db = window.openDatabase("face.db", "1.0", "Dev Database", 200000); //To test in web browser with ionic serve


        /* A RETIRER */
        /* A RETIRER */
        /* A RETIRER */
        /* A RETIRER */
        /* A RETIRER */
        /* A RETIRER */
        /* A RETIRER */
        /* A RETIRER */
        /*        $cordovaSQLite.execute(db, "DROP table word");
                $cordovaSQLite.execute(db, "DROP table sign");
                $cordovaSQLite.execute(db, "DROP table video");
                $cordovaSQLite.execute(db, "DROP table wording");
                $cordovaSQLite.execute(db, "DROP table configuration");
                $cordovaSQLite.execute(db, "DROP table subtitle");
                $cordovaSQLite.execute(db, "DROP table dialog");
                $cordovaSQLite.execute(db, "DROP table genealogy");
                $cordovaSQLite.execute(db, "DROP table videoQCM");
                $cordovaSQLite.execute(db, "DROP table sentenceQCM");

                $cordovaSQLite.execute(db, "DROP table positionConfigurationSign");*/
        /*___________________*/

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS word(id INTEGER PRIMARY KEY, frenchWord TEXT, englishWord TEXT, signIDLSF INTEGER, signIDASL INTEGER,FOREIGN KEY(signIDLSF) REFERENCES sign(id), FOREIGN KEY(signIDASL) REFERENCES sign(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS sign(id INTEGER PRIMARY KEY, language INTEGER, videoID INTEGER, FOREIGN KEY(videoID) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS configuration(id INTEGER PRIMARY KEY, language INTEGER, imageURL TEXT)");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS position(id INTEGER PRIMARY KEY, positionName TEXT)");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS wording(id INTEGER PRIMARY KEY, wordID INTEGER, videoIDLSF INTEGER, videoIDASL INTEGER, FOREIGN KEY(wordID) REFERENCES word(id), FOREIGN KEY(videoIDLSF) REFERENCES video(id), FOREIGN KEY(videoIDASL) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS video(id INTEGER PRIMARY KEY, youtubeURL TEXT, localURL TEXT)");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS sentenceQCM(id INTEGER PRIMARY KEY, difficultyLevel INTEGER, frenchSentence TEXT, englishSentence TEXT, videoIDALSF INTEGER,videoIDAASL INTEGER, videoIDBLSF INTEGER, videoIDBASL INTEGER, videoIDCLSF INTEGER, videoIDCASL INTEGER, videoIDDLSF INTEGER, videoIDDASL INTEGER, goodAnswer TEXT, FOREIGN KEY(videoIDALSF) REFERENCES video(id) ON DELETE CASCADE, FOREIGN KEY(videoIDAASL) REFERENCES video(id) ON DELETE CASCADE, FOREIGN KEY(videoIDBLSF) REFERENCES video(id) ON DELETE CASCADE, FOREIGN KEY(videoIDBASL) REFERENCES video(id) ON DELETE CASCADE, FOREIGN KEY(videoIDCLSF) REFERENCES video(id) ON DELETE CASCADE, FOREIGN KEY(videoIDCASL) REFERENCES video(id) ON DELETE CASCADE, FOREIGN KEY(videoIDDLSF) REFERENCES video(id) ON DELETE CASCADE, FOREIGN KEY(videoIDDASL) REFERENCES video(id) ON DELETE CASCADE)");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS videoQCM(id INTEGER PRIMARY KEY, difficultyLevel INTEGER, videoIDLSF INTEGER, videoIDASL INTEGER, englishSentenceA TEXT, frenchSentenceA TEXT, englishSentenceB TEXT, frenchSentenceB TEXT, englishSentenceC TEXT, frenchSentenceC TEXT, englishSentenceD TEXT, frenchSentenceD TEXT, goodAnswer TEXT, FOREIGN KEY(videoIDLSF) REFERENCES video(id) ON DELETE CASCADE, FOREIGN KEY(videoIDASL) REFERENCES video(id) ON DELETE CASCADE)");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS genealogy(id INTEGER PRIMARY KEY, wordID INTEGER, frenchDescription TEXT, englishDescription TEXT, videoIDLSFDescription INTEGER, videoIDASLDescription INTEGER, FOREIGN KEY (wordID) REFERENCES word(id),FOREIGN KEY (videoIDLSFDescription) REFERENCES video(id), FOREIGN KEY (videoIDASLDescription) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS signExplanation(id INTEGER PRIMARY KEY, wordID INTEGER, frenchExplanation TEXT, englishExplanation TEXT, videoIDLSFExplanation INTEGER, videoIDASLExplanation INTEGER, FOREIGN KEY (wordID) REFERENCES word(id),FOREIGN KEY (videoIDLSFExplanation) REFERENCES video(id), FOREIGN KEY (videoIDASLExplanation) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS dialog(id INTEGER PRIMARY KEY, wordID INTEGER, language INTEGER, videoID INTEGER, FOREIGN KEY(wordID) REFERENCES word(id), FOREIGN KEY(videoID) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS positionConfigurationSign(signID INTEGER, configurationIDDominating INTEGER, positionIDDominating INTEGER, configurationIDDominated INTEGER, positionIDDominated INTEGER,  FOREIGN KEY(signID) REFERENCES sign(id), FOREIGN KEY(configurationIDDominating) REFERENCES configuration(id), FOREIGN KEY(positionIDDominating) REFERENCES position(id), FOREIGN KEY(configurationIDDominated) REFERENCES configuration(id), FOREIGN KEY(positionIDDominated) REFERENCES position(id), PRIMARY KEY (signID, configurationIDDominating, positionIDDominating,configurationIDDominated))");
    });
});

app.controller("HomeCtrl", function($scope, $ionicLoading, $http, $cordovaSQLite) {

    // Insert a new word and all the corresponding information (first insert videos, then signs, then the word)
    $scope.insertNewWord = function(frenchWord, englishWord, frenchYoutubeURL, englishYoutubeURL) {
        var answer = $scope.insertNewWordVideos(frenchWord, englishWord, frenchYoutubeURL, englishYoutubeURL, $scope.insertNewWordSigns);
    };

    $scope.insertNewWordVideos = function(frenchWord, englishWord, frenchYoutubeURL, englishYoutubeUrl, callback) {
        var query = "INSERT INTO video (youtubeURL) values (?),(?)";
        $cordovaSQLite.execute(db, query, [frenchYoutubeURL, englishYoutubeUrl]).then(function(res) {
            console.log("Videos successfully added -> " + res.insertId);
            return callback(frenchWord, englishWord, res.insertId - 1, res.insertId, $scope.insertWord);
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.insertNewWordSigns = function(frenchWord, englishWord, idFrenchVideo, idEnglishVideo, callback) {
        var query = "INSERT INTO sign (language, videoID) VALUES(0, ?),(1, ?)";
        $cordovaSQLite.execute(db, query, [idFrenchVideo, idEnglishVideo]).then(function(res) {
            console.log("Signs successfully added -> " + res.insertId);
            return callback(frenchWord, englishWord, res.insertId - 1, res.insertId);
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.insertWord = function(frenchWord, englishWord, idFrenchSign, idEnglishSign) {
        var query = "INSERT INTO word (frenchWord, englishWord, signIDLSF, signIDASL) values(?, ?, ?, ?)";
        $cordovaSQLite.execute(db, query, [frenchWord, englishWord, idFrenchSign, idEnglishSign]).then(function(res) {
            console.log("Word successfully added -> " + res.insertId);
            return res.insertId;
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    // Insert a new wording and all the corresponding information (first insert videos, then wordings)
    $scope.insertNewWording = function(idWord, youtubeURLLSF1, youtubeURLASL1, youtubeURLLSF2, youtubeURLASL2) {
        var answer = $scope.insertNewWordingVideos(idWord, youtubeURLLSF1, youtubeURLASL1, youtubeURLLSF2, youtubeURLASL2, $scope.insertWording);
    };

    $scope.insertNewWordingVideos = function(idWord, youtubeURLLSF1, youtubeURLASL1, youtubeURLLSF2, youtubeURLASL2, callback) {
        var query = "INSERT INTO video (youtubeURL) values (?),(?),(?),(?)";
        $cordovaSQLite.execute(db, query, [youtubeURLLSF1, youtubeURLASL1, youtubeURLLSF2, youtubeURLASL2]).then(function(res) {
            console.log("Videos successfully added -> " + res.insertId);
            return callback(idWord, res.insertId - 3, res.insertId - 2, res.insertId - 1, res.insertId);
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.insertWording = function(idWord, idVideoLSF1, idVideoASL1, idVideoLSF2, idVideoASL2) {
        var query = "INSERT INTO wording (wordID, videoIDLSF, videoIDASL) values(?, ?, ?),(?, ?, ?)";
        $cordovaSQLite.execute(db, query, [idWord, idVideoLSF1, idVideoASL1, idWord, idVideoLSF2, idVideoASL2]).then(function(res) {
            console.log("Wordings successfully added -> " + res.insertId);
            return res.insertId;
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    // Insert new dialog and all the corresponding information
    $scope.insertNewDialog = function(wordID, language, youtubeURL) {
        var answer = $scope.insertDialogVideos(wordID, language, youtubeURL, $scope.insertDialog);
    };

    $scope.insertDialogVideos = function(wordID, language, youtubeURL, callback) {
        var query = "INSERT INTO video (youtubeURL) values (?)";
        $cordovaSQLite.execute(db, query, [youtubeURL]).then(function(res) {
            console.log("Videos successfully added -> " + res.insertId);
            return callback(wordID, language, res.insertId);
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    //Insert new Sentence QCM and all the corresponding information
    $scope.insertNewSentenceQCM = function(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer) {
        $scope.insertSentenceQCMVideos(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer, $scope.insertSentenceQCM);
    };

    $scope.insertSentenceQCMVideos = function(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer, callback) {
        var query = "INSERT INTO video (youtubeURL) values (?),(?),(?),(?),(?),(?),(?),(?)";
        $cordovaSQLite.execute(db, query, [videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL]).then(function(res) {
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId - 7));
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId - 6));
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId - 5));
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId - 4));
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId - 3));
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId - 2));
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId - 1));
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId));
            return callback(difficultyLevel, frenchSentence, englishSentence, res.insertId - 7, res.insertId - 6, res.insertId - 5, res.insertId - 4, res.insertId - 3, res.insertId - 2, res.insertId - 1, res.insertId, goodAnswer);
        }, function(err) {
            console.error(err);
            return -1;
        });
    };


    $scope.insertSentenceQCM = function(difficultyLevel, frenchSentence, englishSentence, videoIDALSF, videoIDAASL, videoIDBLSF, videoIDBASL, videoIDCLSF, videoIDCASL, videoIDDLSF, videoIDDASL, goodAnswer) {
        var query = "INSERT INTO sentenceQCM (difficultyLevel, frenchSentence, englishSentence, videoIDALSF, videoIDAASL, videoIDBLSF, videoIDBASL, videoIDCLSF, videoIDCASL, videoIDDLSF, videoIDDASL, goodAnswer) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $cordovaSQLite.execute(db, query, [difficultyLevel, frenchSentence, englishSentence, videoIDALSF, videoIDAASL, videoIDBLSF, videoIDBASL, videoIDCLSF, videoIDCASL, videoIDDLSF, videoIDDASL, goodAnswer]).then(function(res) {

            console.log("Sentence successfully added -> " + res.insertId);

            return res.insertId;

        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    //Insert new video QCM and all the corresponding information
    $scope.insertNewVideoQCM = function(difficultyLevel, youtubeURLLSF, youtubeURLASL, englishSentenceA, frenchSentenceA, englishSentenceB, frenchSentenceB, englishSentenceC, frenchSentenceC, englishSentenceD, frenchSentenceD, goodAnswer) {
        $scope.insertVideoQCMVideos(difficultyLevel, youtubeURLLSF, youtubeURLASL, englishSentenceA, frenchSentenceA, englishSentenceB, frenchSentenceB, englishSentenceC, frenchSentenceC, englishSentenceD, frenchSentenceD, goodAnswer, $scope.insertVideoQCM);
    };

    $scope.insertVideoQCMVideos = function(difficultyLevel, youtubeURLLSF, youtubeURLASL, englishSentenceA, frenchSentenceA, englishSentenceB, frenchSentenceB, englishSentenceC, frenchSentenceC, englishSentenceD, frenchSentenceD, goodAnswer, callback) {
        var query = "INSERT INTO video (youtubeURL) values (?),(?)";
        $cordovaSQLite.execute(db, query, [youtubeURLLSF, youtubeURLASL]).then(function(res) {
            console.log("VideoQCM successfully added -> " + res.insertId);
            return callback(difficultyLevel, res.insertId - 1, res.insertId, englishSentenceA, frenchSentenceA, englishSentenceB, frenchSentenceB, englishSentenceC, frenchSentenceC, englishSentenceD, frenchSentenceD, goodAnswer);
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.insertVideoQCM = function(difficultyLevel, videoIDLSF, videoIDASL, englishSentenceA, frenchSentenceA, englishSentenceB, frenchSentenceB, englishSentenceC, frenchSentenceC, englishSentenceD, frenchSentenceD, goodAnswer) {
        var query = "INSERT INTO videoQCM (difficultyLevel, videoIDLSF, videoIDASL, englishSentenceA, frenchSentenceA, englishSentenceB, frenchSentenceB, englishSentenceC, frenchSentenceC, englishSentenceD, frenchSentenceD, goodAnswer) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $cordovaSQLite.execute(db, query, [difficultyLevel, videoIDLSF, videoIDASL, englishSentenceA, frenchSentenceA, englishSentenceB, frenchSentenceB, englishSentenceC, frenchSentenceC, englishSentenceD, frenchSentenceD, goodAnswer]).then(function(res) {

            console.log("Videos successfully added -> " + res.insertId);

            return res.insertId;

        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    //Insert new video QCM and all the corresponding information
    $scope.insertNewSignExplanation = function(wordID, frenchExplanation, englishExplanation, youtubeURLLSF, youtubeURLASL) {
        $scope.insertVideoSignExplanation(wordID, frenchExplanation, englishExplanation, youtubeURLLSF, youtubeURLASL, $scope.insertSignExplanation);
    };

    $scope.insertVideoSignExplanation = function(wordID, frenchExplanation, englishExplanation, youtubeURLLSF, youtubeURLASL, callback) {
        var query = "INSERT INTO video (youtubeURL) values (?),(?)";
        $cordovaSQLite.execute(db, query, [youtubeURLLSF, youtubeURLASL]).then(function(res) {
            console.log("Videos successfully added -> " + res.insertId);
            return callback(wordID, frenchExplanation, englishExplanation, res.insertId - 1, res.insertId);
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.insertSignExplanation = function(wordID, frenchExplanation, englishExplanation, videoIDLSF, videoIDASL) {
        var query = "INSERT INTO signExplanation (wordID, frenchExplanation, englishExplanation, videoIDLSFExplanation, videoIDASLExplanation) values (?, ?, ?, ?, ?)";
        $cordovaSQLite.execute(db, query, [wordID, frenchExplanation, englishExplanation, videoIDLSF, videoIDASL]).then(function(res) {

            console.log("SignExplanation successfully added -> " + res.insertId);

            return res.insertId;

        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.insertDialog = function(wordID, language, videoID) {
        var query = "INSERT INTO dialog (wordID, language, videoID) VALUES(?, ?, ?)";
        $cordovaSQLite.execute(db, query, [wordID, language, videoID]).then(function(res) {
            console.log("Dialog successfully added -> " + res.insertId);
            return res.insertId;
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.insertVideo = function(youtubeURL) {
        var query = "INSERT INTO video (youtubeURL) values(?)";
        $cordovaSQLite.execute(db, query, [youtubeURL]).then(function(res) {
            console.log("Video successfully added -> " + res.insertId);
            return res.insertId;
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.insertSign = function(language, idVideo) {
        var query = "INSERT INTO sign (language, videoID) values(?, ?)";
        $cordovaSQLite.execute(db, query, [language, idVideo]).then(function(res) {
            console.log("Sign successfully added -> " + res.insertId);
            return res.insertId;
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.insertConfiguration = function(language, imageURL) {
        var query = "INSERT INTO configuration (language, imageURL) values(?, ?)";
        $cordovaSQLite.execute(db, query, [language, imageURL]).then(function(res) {
            console.log("Configuration successfully added -> " + res.insertId + " " + imageURL);
            return res.insertId;
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.insertPosition = function(id, positionName) {
        var query = "INSERT INTO position (id, positionName) values(?, ?)";
        $cordovaSQLite.execute(db, query, [id, positionName]).then(function(res) {
            console.log("Position successfully added -> " + res.insertId + " " + positionName);
            return res.insertId;
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.insertPositionConfigurationSign = function(signID, configurationIDDominating, positionIDDominating) {
        var query = "INSERT INTO positionConfigurationSign (signID, configurationIDDominating, positionIDDominating) values(?, ?, ?)";
        $cordovaSQLite.execute(db, query, [signID, configurationIDDominating, positionIDDominating]).then(function(res) {
            console.log("Position Configuration Sign successfully added -> " + res.insertId + " " + signID);
            return res.insertId;
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.insertPositionConfigurationSign = function(signID, configurationIDDominating, positionIDDominating, configurationIDDominated, positionIDDominated) {
        var query = "INSERT INTO positionConfigurationSign (signID, configurationIDDominating, positionIDDominating, configurationIDDominated, positionIDDominated) values(?, ?, ?, ?, ?)";
        $cordovaSQLite.execute(db, query, [signID, configurationIDDominating, positionIDDominating, configurationIDDominated, positionIDDominated]).then(function(res) {
            console.log("Position Configuration Sign successfully added -> " + res.insertId + " " + signID);
            return res.insertId;
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.deleteWord = function(mot) {
        var query = "DELETE FROM word where frenchWord = ?";
        $cordovaSQLite.execute(db, query, [mot]).then(function(res) {
            console.log("Successful delete " + res);
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

    /*   $scope.insertNewSignExplanation(1, "Le signe-ancêtre commun, attesté pour la première fois en France en 1784 et importé aux USA au début du XXème siècle, comportait deux parties.", "There is a lot of interesting things to say about this sign.", "https://www.youtube.com/embed/87tCKyr5sa4", "https://www.youtube.com/embed/jP5-qP-LTE8");


       $scope.insertNewWord("Racine", "Root", "https://www.youtube.com/embed/XQEFR5YmIP4", "https://www.youtube.com/embed/9IMWwkhv610");
       $scope.insertNewWord("Rang", "Rank", "https://www.youtube.com/embed/-TBhtvoJFmM", "https://www.youtube.com/embed/1D0WPo2wTSA");

       $scope.insertNewWording(1, "https://www.youtube.com/embed/60pdCwdN-kg", "https://www.youtube.com/embed/yhy19VUoKAY", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/9mp2E58UlR4");

       $scope.insertNewDialog(1, 1, "https://www.youtube.com/embed/yhy19VUoKAY");

       for (i = 0; i < 46; i++) {
           $scope.insertConfiguration(0, "../config_" + (i + 1) + ".jpg");
       }

       $scope.insertNewVideoQCM(1, "https://www.youtube.com/embed/9mp2E58UlR4", "https://www.youtube.com/embed/YVP6M2u2sf0", "Maybe", "Peut-être", "Not sure", "Pas sûr", "Oh yes", "Oh oui", "Cat", "Chat", "B");

       $scope.insertNewSentenceQCM(1, "Bob est perdu dans toutes ces lignes de code", "Bob is lost in all those lines of code", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "B");

       $scope.insertNewSentenceQCM(1, "Bob a nettoyé quelques lignes de codes et n'est plus autant perdu qu'avant.", "Bob cleaned some lines of codes and isn't as lost as before.", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/wZZ7oFKsKzY", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/wZZ7oFKsKzY", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "A");*/

    /*$scope.insertPosition(0,"mouth");
     $scope.insertPosition(1,"chin");
     $scope.insertPosition(2,"throat");
     $scope.insertPosition(3,"cheek");
     $scope.insertPosition(4,"temple");
     $scope.insertPosition(5,"eyes");
     $scope.insertPosition(6,"forehead");
     $scope.insertPosition(7,"rightpectoral");
     $scope.insertPosition(8,"leftpectoral");
     $scope.insertPosition(9,"thorax");
     $scope.insertPosition(10,"stomach");
     $scope.insertPosition(11,"rightarm");
     $scope.insertPosition(12,"rightforearm");
     $scope.insertPosition(13,"rightelbow");
     $scope.insertPosition(14,"lefthand");
     $scope.insertPosition(15,"righthand");

    //first configuration Mouth  first configuration Chin
    $scope.insertPositionConfigurationSign(1, 1, 0, 1, 1);
    $scope.insertPositionConfigurationSign(3, 1, 0, 1, 1);
    $scope.insertPositionConfigurationSign(2, 2, 0, 1, 1);
    $scope.insertPositionConfigurationSign(3, 1, 0);

    /*$scope.searchFrenchWord("Romain");
    setTimeout(function(){
        console.log($scope.word.frenchWord);
        //$scope.deleteWord("Romain");
    }, 2000);*/


});

// Factory service to share word between controllers
app.factory('SharingWordInformation', function() {
    var word = {};
    var possibleWordList = [];
    var wordingChoice = 0;
    var dialogChoice = 0;
    var dialogLanguageChoice = 0;

    return {
        getWord: function() {
            return word;
        },
        setWord: function(newWord) {
            // If the word we want to search is not set or if it is not the last one we searched
            if (word.id == undefined || (word.id != undefined && word.id != newWord.id)) {
                word = newWord;
            }
        },
        getWordingChoice: function() {
            return wordingChoice;
        },
        setWordingChoice: function(number) {
            wordingChoice = number;
        },
        getDialogChoice: function() {
            return dialogChoice;
        },
        setDialogChoice: function(number) {
            dialogChoice = number;
        },
        getDialogLanguageChoice: function() {
            return dialogLanguageChoice;
        },
        setDialogLanguageChoice: function(number) {
            dialogLanguageChoice = number;
        },
        getPossibleWordList: function() {
            return possibleWordList;
        },
        setPossibleWordList: function(array) {
            possibleWordList = array.slice();
        }
    };
});

// Factory service to share qcm information between controllers
app.factory('SharingQCMInformation', function() {
    var difficultyLevel = 0;

    return {
        getDifficultyLevel: function() {
            return difficultyLevel;
        },
        setDifficultyLevel: function(level) {
            difficultyLevel = level;
        }
    };
});

app.factory("SharingSentenceQCMInformation", function() {
    var qcm = {};
    return {
        getSentenceQCM: function() {
            return qcm;
        },
        setSentenceQCM: function(object) {
            qcm = object;
        }
    }
});

app.factory("SharingConfigurationsLSF", function() {
    var selectedConfigurationsLSF = [];

    var getConfigurationsLSF = function() {
        return selectedConfigurationsLSF;
    }

    var setConfigurationsLSF = function(array) {
        selectedConfigurationsLSF = array.slice()
    }

    return {
        getConfigurationsLSF: getConfigurationsLSF,
        setConfigurationsLSF: setConfigurationsLSF
    }
});



app.controller("LSFSearch", function($scope, $ionicLoading, $http, $ionicScrollDelegate, $ionicPopup, $location, $state, SharingConfigurationsLSF) {

    $scope.images = [];
    $scope.selectedHand = "";
    $scope.selectedConfigurations = [null, null];

    // Scroll to the top of the page
    scrollTop = function() {
        $ionicScrollDelegate.scrollTop(true);
    };

    // Loading french sign configurations in scope.images
    $scope.loadImages = function() {
        if ($scope.images.length == 0) {
            for (var i = 1; i < 47; i++) {
                $scope.images.push({
                    src: "../img/sign_config/config_" + i.toString() + ".jpg",
                    id: i
                });
            };
        }
    };

    $scope.activateSelection = function(handDivisionID) {
        $scope.selectedHand = handDivisionID;

        document.getElementById("configuration-grid").style.visibility = 'visible';
    };

    $scope.configurationSelected = function(image) {
        if ($scope.selectedHand != "") {
            //Check if selectedHand is the first or second to insert correctly in the array
            if ($scope.selectedHand == "first-hand-picture")
                $scope.selectedConfigurations[0] = image;
            else if ($scope.selectedHand == "second-hand-picture")
                $scope.selectedConfigurations[1] = image;

            console.log($scope.selectedConfigurations)

            document.getElementById($scope.selectedHand).style = "background-image: url(" + image.src + ");";

            $scope.selectedHand = "";

            document.getElementById("configuration-grid").style.visibility = 'hidden';

            scrollTop();
        }
    };

    $scope.deleteChosenConfiguration = function(handDivisionID) {
        if (handDivisionID == "first-hand-picture")
            $scope.selectedConfigurations[0] = null;
        else if (handDivisionID == "second-hand-picture")
            $scope.selectedConfigurations[1] = null;

        console.log($scope.selectedConfigurations)

        document.getElementById(handDivisionID).style = "background-image: url('../img/hand.png');";
    };

    $scope.selectPositions = function() {
        if ($scope.selectedConfigurations[0] != null) {
            SharingConfigurationsLSF.setConfigurationsLSF($scope.selectedConfigurations);
            $state.go("position-skeleton");
        } else {
            //Display alert message
            $ionicPopup.alert({
                title: 'Vous devez obligatoirement choisir une configuration pour la main active.',
                cssClass: 'alert-popup'
            });
        }
    };


});


app.controller("Skeleton", function($scope, $ionicLoading, $http, $ionicScrollDelegate, $ionicPopup, $cordovaSQLite, $location, $state, SharingWordInformation, SharingConfigurationsLSF) {
    var selectedConfigurations = SharingConfigurationsLSF.getConfigurationsLSF();

    $scope.activeHand = selectedConfigurations[0];
    $scope.passiveHand = selectedConfigurations[1];

    var activeHandPosition = {};
    var passiveHandPosition = {};
    var currentSelectedHand = "";

    var possibleWordList = [];

    $scope.activateSelection = function(handDivID) {
        if (handDivID == "first-hand-picture") {
            activeHandPosition['src'] = $scope.activeHand.src;
            activeHandPosition['signID'] = $scope.activeHand.id;
        } else if (handDivID == "second-hand-picture" && $scope.passiveHand != null) {
            passiveHandPosition['src'] = $scope.passiveHand.src;
            passiveHandPosition['signID'] = $scope.passiveHand.id;
        }
        currentSelectedHand = handDivID;
    };

    $scope.setPosition = function(positionName, positionID) {
        if (activeHandPosition['src'] != null && activeHandPosition['signID'] != null && currentSelectedHand == "first-hand-picture") {
            if (activeHandPosition['position']) {
                document.getElementsByClassName(activeHandPosition['position'])[0].style.backgroundColor = "red";
            }
            activeHandPosition['position'] = positionName;
            activeHandPosition['positionID'] = positionID;
            document.getElementsByClassName(positionName)[0].style.backgroundColor = "#00FF0C";
            console.log(activeHandPosition);
        } else {
            if (passiveHandPosition['position']) {
                document.getElementsByClassName(passiveHandPosition['position'])[0].style.backgroundColor = "red";
            }
            passiveHandPosition['position'] = positionName
            passiveHandPosition['positionID'] = positionID;
            document.getElementsByClassName(positionName)[0].style.backgroundColor = "#00FF0C";
            console.log(passiveHandPosition);
        }
    };

    $scope.submitConfigurationsPositions = function() {

        var query = "";
        var possibleSignIDList = [];
        //If passiveHand doesn't exist
        if (Object.keys(passiveHandPosition).length == 0) {
            query = "SELECT word.id, frenchWord, englishWord, signIDLSF, signIDASL from word, positionConfigurationSign WHERE word.signIDLSF = positionConfigurationSign.signID AND configurationIDDominating = ? AND positionIDDominating = ?  AND configurationIDDominated = \"undefined\" AND positionIDDominated = \"undefined\"";
            $cordovaSQLite.execute(db, query, [activeHandPosition['signID'], activeHandPosition['positionID']]).then(function(res) {
                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        possibleWordList.push(res.rows.item(i));
                    };


                } else {
                    console.log("No results found");
                }
                $scope.checkResults();
            }, function(err) {
                console.error(err);
            });
        }
        // If activehandPosition & passivehandPosition exist
        else {
            query = "SELECT word.id, frenchWord, englishWord, signIDLSF, signIDASL from word, positionConfigurationSign WHERE word.signIDLSF = positionConfigurationSign.signID AND configurationIDDominating = ? AND positionIDDominating = ?  AND configurationIDDominated = ? AND positionIDDominated = ?";
            $cordovaSQLite.execute(db, query, [activeHandPosition['signID'], activeHandPosition['positionID'], passiveHandPosition['signID'], passiveHandPosition['positionID']]).then(function(res) {
                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        possibleWordList.push(res.rows.item(i));
                    };


                } else {
                    console.log("No results found");
                }
                $scope.checkResults();
            }, function(err) {
                console.error(err);
            });
        }
    };

    $scope.checkResults = function() {
        if (possibleWordList.length > 1) {
            SharingWordInformation.setPossibleWordList(possibleWordList);
            $state.go("word-selection");
        } else if (possibleWordList.length == 1) {
            SharingWordInformation.setWord(possibleWordList[0]);
            $state.go("word-presentation");
        } else {
            //Display alert message
            $ionicPopup.alert({
                title: 'Aucun mot ne correspond à cette combinaison.',
                cssClass: 'alert-popup'
            });
        }
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

app.controller("WordSearch", function($scope, $ionicLoading, $http, $cordovaSQLite, $state, SharingWordInformation) {

    var language;

    $scope.initSearchPage = function() {

        if ($state.current.name == "fr-search") {
            language = 0;
            $scope.flagPicture = "../img/France-Flag-icon-little.png";
            $scope.viewTitle = "Recherche Française";
        } else {
            language = 1;
            $scope.flagPicture = "../img/United-States-Flag-icon-little.png";
            $scope.viewTitle = "English Search";
        }
    }

    // Search potential words which start like the
    $scope.searchPotentialWords = function(searchedWord) {
        $scope.words = [];

        if (searchedWord != "") {
            var query = "SELECT * FROM word WHERE " + (language == 0 ? "frenchWord" : "englishWord") + " LIKE ?";
            $cordovaSQLite.execute(db, query, [searchedWord + "%"]).then(function(res) {
                if (res.rows.length > 0) {
                    console.log("SearchPotentialWords : SELECTED -> " + res.rows.length);

                    var numberWords = (res.rows.length > 5 ? 5 : res.rows.length);

                    for (var i = 0; i < numberWords; i++) {
                        $scope.words.push(res.rows.item(i));

                        if (language == 0)
                            $scope.words[i].shownWord = res.rows.item(i).frenchWord;
                        else
                            $scope.words[i].shownWord = res.rows.item(i).englishWord;
                    };
                } else {
                    console.log("No results found");
                }
            }, function(err) {
                console.error(err);
            });
        }
    };

    $scope.setWord = function(word) {
        SharingWordInformation.setWord(word);
    };
});

app.controller("WordSelection", function($scope, $ionicLoading, $http, $cordovaSQLite, $state, SharingWordInformation) {

    $scope.initWordSelection = function() {
        $scope.words = SharingWordInformation.getPossibleWordList();
    }

    $scope.setWord = function(word) {
        SharingWordInformation.setWord(word);
    };
});

app.controller("WordPresentation", function($scope, $sce, $ionicLoading, $http, $cordovaSQLite, SharingWordInformation) {

    $scope.prepareWordInformation = function() {
        $scope.word = SharingWordInformation.getWord();

        // If we don't have the word information in memory, we execute a search query
        if ($scope.word.frenchVideo == undefined || $scope.word.englishVideo == undefined) {
            var query = "SELECT signIDLSF, signIDASL FROM word WHERE id = ?";
            $cordovaSQLite.execute(db, query, [$scope.word.id]).then(function(res) {
                if (res.rows.length > 0) {
                    console.log("prepareWordInformations : SELECTED -> " + res.rows.item(0));

                    $scope.searchYoutubeURLBySignIDs(res.rows.item(0).signIDLSF, res.rows.item(0).signIDASL);

                } else {
                    console.log("No results found");
                }
            }, function(err) {
                console.error(err);
            });
        }
    };

    // Search for the youtube URL of the sign videos
    $scope.searchYoutubeURLBySignIDs = function(idSignLSF, idSignASL) {

        var query = "SELECT language, youtubeURL, localURL FROM sign, video WHERE (sign.id = ? OR sign.id = ?) AND sign.videoID = video.id";
        $cordovaSQLite.execute(db, query, [idSignLSF, idSignASL]).then(function(res) {
            if (res.rows.length == 2) {
                console.log("searchYoutubeURLBySignIDs : SELECTED -> " + res.rows.length);

                if (res.rows.item(0).language = 0) {
                    $scope.word.englishVideo = res.rows.item(0);
                    $scope.word.frenchVideo = res.rows.item(1);
                } else {
                    $scope.word.englishVideo = res.rows.item(1);
                    $scope.word.frenchVideo = res.rows.item(0);
                }

            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    };

    // Trust the URL so Angular can load the corresponding template
    $scope.trustUrl = function(url) {
        return $sce.trustAsResourceUrl(url);
    }

    $scope.setWord = function() {
        SharingWordInformation.setWord($scope.word);
    };

    $scope.setWordingChoice = function(number) {
        SharingWordInformation.setWordingChoice(number);
    }
});

app.controller("WordingPresentation", function($scope, $sce, $ionicLoading, $http, $cordovaSQLite, SharingWordInformation) {

    $scope.prepareWordingInformation = function() {
        $scope.word = SharingWordInformation.getWord();
        $scope.wordingChoice = SharingWordInformation.getWordingChoice();

        // Set information for the other wording button
        if ($scope.wordingChoice == 0) {
            $scope.otherWordingName = "Enoncé n°2";
            $scope.otherWordingNumber = 2;
        } else {
            $scope.otherWordingName = "Enoncé n°1";
            $scope.otherWordingNumber = 1;
        }

        // If we don't have the word's wordings information in memory, we execute a search query
        if ($scope.word.wordingLSF == undefined && $scope.word.wordingASL == undefined) {

            var query = "SELECT * FROM wording WHERE wordID = ?";
            $cordovaSQLite.execute(db, query, [$scope.word.id]).then(function(res) {
                if (res.rows.length > 0) {
                    console.log("prepareWordingInformation : SELECTED -> " + res.rows.length);

                    $scope.searchYoutubeURLByIDs(res.rows.item(0).videoIDLSF, res.rows.item(0).videoIDASL, res.rows.item(1).videoIDLSF, res.rows.item(1).videoIDASL);

                } else {
                    console.log("No results found");
                }
            }, function(err) {
                console.error(err);
            });
        }
    };


    $scope.searchYoutubeURLByIDs = function(videoIDLSF1, videoIDASL1, videoIDLSF2, videoIDASL2) {

        var query = "SELECT * FROM video WHERE id = ? OR id = ? OR id = ? OR id = ?";
        $cordovaSQLite.execute(db, query, [videoIDLSF1, videoIDASL1, videoIDLSF2, videoIDASL2]).then(function(res) {
            if (res.rows.length == 4) {
                $scope.word.wordingLSF = [];
                $scope.word.wordingASL = [];

                console.log("searchYoutubeURLBySignIDs : SELECTED -> " + res.rows.length);

                for (var i = 0; i < 4; i++) {
                    console.log(res.rows.item(i))
                    switch (res.rows.item(i).id) {
                        case videoIDLSF1:
                            $scope.word.wordingLSF[0] = res.rows.item(i);
                            break;
                        case videoIDASL1:
                            $scope.word.wordingASL[0] = res.rows.item(i);
                            break;
                        case videoIDLSF2:
                            $scope.word.wordingLSF[1] = res.rows.item(i);
                            break;
                        case videoIDASL2:
                            $scope.word.wordingASL[1] = res.rows.item(i);
                            break;
                    }
                }

            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    };

    // Enable to trust the URL so Angular can load the corresponding template
    $scope.trustUrl = function(url) {
        return $sce.trustAsResourceUrl(url);
    }

    $scope.setWord = function() {
        SharingWordInformation.setWord($scope.word);
    };

    $scope.setWordingChoice = function() {
        if ($scope.wordingChoice == 0)
            SharingWordInformation.setWordingChoice(1);
        else
            SharingWordInformation.setWordingChoice(0);
    }
});

app.controller("DialogList", function($scope, $sce, $ionicLoading, $http, $cordovaSQLite, SharingWordInformation) {

    $scope.searchDialogs = function() {
        $scope.word = SharingWordInformation.getWord();

        // If we don't have the word's wordings information in memory, we execute a search query
        if ($scope.word.frenchDialogList == undefined && $scope.word.englishDialogList == undefined) {
            var query = "SELECT * FROM dialog WHERE wordID = ?";
            $cordovaSQLite.execute(db, query, [$scope.word.id]).then(function(res) {
                if (res.rows.length > 0) {
                    console.log("searchDialogs : SELECTED -> " + res.rows.length);

                    $scope.word.frenchDialogList = [];
                    $scope.word.englishDialogList = [];

                    for (i = 0; i < res.rows.length; i++) {
                        if (res.rows.item(i).language == 0)
                            $scope.word.frenchDialogList.push(res.rows.item(i));
                        else
                            $scope.word.englishDialogList.push(res.rows.item(i));
                    }

                } else {
                    console.log("No results found");
                }
            }, function(err) {
                console.error(err);
            });
        }
    };

    $scope.setWord = function() {
        SharingWordInformation.setWord($scope.word);
    };

    $scope.setDialogChoice = function(number, language) {
        SharingWordInformation.setDialogChoice(number);
        SharingWordInformation.setDialogLanguageChoice(language);
    };

    $scope.setWordingChoice = function(number) {
        SharingWordInformation.setWordingChoice(number);
    }

});

app.controller("DialogPresentation", function($scope, $sce, $ionicLoading, $http, $cordovaSQLite, SharingWordInformation) {

    $scope.youtubeURL = {};

    // Search for the youtube URL of the sign videos
    $scope.searchYoutubeURL = function() {

        $scope.word = SharingWordInformation.getWord();
        $scope.dialogChoice = SharingWordInformation.getDialogChoice();
        $scope.dialogLanguageChoice = SharingWordInformation.getDialogLanguageChoice();

        var videoID;

        // Get the video ID of the corresponding dialog
        if ($scope.dialogLanguageChoice == 0)
            videoID = $scope.word.frenchDialogList[$scope.dialogChoice].videoID;
        else
            videoID = $scope.word.englishDialogList[$scope.dialogChoice].videoID;

        var query = "SELECT youtubeURL, localURL FROM video WHERE id=?";
        $cordovaSQLite.execute(db, query, [videoID]).then(function(res) {
            if (res.rows.length == 1) {
                console.log("searchYoutubeURLBySignIDs : SELECTED -> " + res.rows.length);

                // Store the youtube url
                $scope.youtubeURL = res.rows.item(0).youtubeURL;

            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    };

    // Enable to trust the URL so Angular can load the corresponding template
    $scope.trustUrl = function(url) {
        return $sce.trustAsResourceUrl(url);
    };

    $scope.setWord = function() {
        SharingWordInformation.setWord($scope.word);
    };

    $scope.setWordingChoice = function(number) {
        SharingWordInformation.setWordingChoice(number);
    }
});

app.controller("SignExplanation", function($scope, $sce, $ionicLoading, $http, $cordovaSQLite, SharingWordInformation) {

    $scope.prepareSignExplanation = function() {
        $scope.word = SharingWordInformation.getWord();

        // If we don't have the sign's explanation
        if ($scope.word.signExplanation == undefined) {

            var query = "SELECT * FROM signExplanation WHERE wordID = ?";
            $cordovaSQLite.execute(db, query, [$scope.word.id]).then(function(res) {
                if (res.rows.length > 0) {
                    console.log("prepareSignExplanation : SELECTED -> " + res.rows.length);

                    $scope.word.signExplanation = res.rows.item(0);

                    $scope.searchYoutubeURLByIDs($scope.word.signExplanation.videoIDLSFExplanation, $scope.word.signExplanation.videoIDASLExplanation);

                } else {
                    console.log("No results found");
                }
            }, function(err) {
                console.error(err);
            });
        }
    };

    $scope.searchYoutubeURLByIDs = function(videoIDLSF, videoIDASL) {

        var query = "SELECT * FROM video WHERE id = ? OR id = ?";
        $cordovaSQLite.execute(db, query, [videoIDLSF, videoIDASL]).then(function(res) {
            if (res.rows.length == 2) {

                console.log("searchYoutubeURLBySignIDs : SELECTED -> " + res.rows.length);

                for (var i = 0; i < 2; i++) {
                    console.log(res.rows.item(i))
                    switch (res.rows.item(i).id) {
                        case videoIDLSF:
                            $scope.word.signExplanation.LSFYoutubeURL = res.rows.item(i).youtubeURL;
                            break;
                        case videoIDASL:
                            $scope.word.signExplanation.ASLYoutubeURL = res.rows.item(i).youtubeURL;
                            break;
                    }
                }

            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    };

    // Enable to trust the URL so Angular can load the corresponding template
    $scope.trustUrl = function(url) {
        return $sce.trustAsResourceUrl(url);
    };

    $scope.setWord = function() {
        SharingWordInformation.setWord($scope.word);
    };

    $scope.setWordingChoice = function(number) {
        SharingWordInformation.setWordingChoice(number);
    }
});

app.controller("QCMController", function($scope, $sce, $ionicLoading, $http, $cordovaSQLite, SharingQCMInformation) {

    var videoQCMList = [];
    var sentenceQCMList = [];

    $scope.actualQuestion = {};
    $scope.buttonsDisabled = false;

    // Check the answer given by the user
    $scope.checkVideoQCMAnswer = function(userAnswer, buttonAnswerID) {

        // If the user had the good answer, tells him he is correct
        if (userAnswer == $scope.actualQuestion.goodAnswer) {
            document.getElementById(buttonAnswerID).style.backgroundColor = "#2BBD2D";
            document.getElementById("buttonResult").style.backgroundColor = "#2BBD2D";
            document.getElementById("buttonResult").innerHTML = "Correct !";
        }
        // If he's Incorrect, tells him and show him the good answer
        else {
            document.getElementById(buttonAnswerID).style.backgroundColor = "#C00000";
            document.getElementById("buttonResult").style.backgroundColor = "#C00000"
            document.getElementById("buttonAnswer" + $scope.actualQuestion.goodAnswer).style.backgroundColor = "#2BBD2D";
            document.getElementById("buttonResult").innerHTML = "Incorrect !";
        }

        // Disable click on buttons
        $scope.buttonsDisabled = true;

        document.getElementById("buttonResult").style.visibility = 'visible';
    };

    // Ask a new video QCM question to the user
    $scope.updateVideoQCM = function() {

        // Enable click on buttons
        $scope.buttonsDisabled = false;

        // Reset all the buttons states
        document.getElementById("buttonResult").style.visibility = 'hidden';
        document.getElementById("buttonAnswerA").style.backgroundColor = "";
        document.getElementById("buttonAnswerB").style.backgroundColor = "";
        document.getElementById("buttonAnswerC").style.backgroundColor = "";
        document.getElementById("buttonAnswerD").style.backgroundColor = "";

        // Choose a random question between all the available ones
        var numberChosen = parseInt((Math.random() * videoQCMList.length)) % videoQCMList.length;

        if (videoQCMList[numberChosen].id == $scope.actualQuestion.id) {
            numberChosen = (numberChosen + 1) % videoQCMList.length;
        }

        $scope.actualQuestion = videoQCMList[numberChosen];

        // Search the corresponding video IDs for the question
        $scope.searchURLByIDs($scope.actualQuestion.videoIDLSF, $scope.actualQuestion.videoIDASL);
    };

    $scope.updateSentenceQCM = function() {
        // Select a random question in the list of questions
        // search the corresponding videos, and update view
        // Enable click on buttons
        $scope.buttonsDisabled = false;

        // Reset videos
        $scope.videoLSF = "";
        $scope.videoASL = "";

        // Reset all the buttons states
        document.getElementById("buttonResult-sentenceQCM").style.visibility = 'hidden';
        document.getElementById("buttonResult-sentenceQCM").style.backgroundColor = "";
        document.getElementById("QCMSentenceButtonAnswerA").style.backgroundColor = "";
        document.getElementById("QCMSentenceButtonAnswerB").style.backgroundColor = "";
        document.getElementById("QCMSentenceButtonAnswerC").style.backgroundColor = "";
        document.getElementById("QCMSentenceButtonAnswerD").style.backgroundColor = "";

        // Choose a random question between all the available ones
        var numberChosen = parseInt((Math.random() * sentenceQCMList.length)) % sentenceQCMList.length;

        if (sentenceQCMList[numberChosen].id == $scope.actualQuestion.id) {
            numberChosen = (numberChosen + 1) % sentenceQCMList.length;
        }

        $scope.actualQuestion = sentenceQCMList[numberChosen];


    };

    // Load all the Videos QCM questions with the corresponding difficulty level
    $scope.loadVideoQuestions = function() {
        $scope.difficultyLevel = SharingQCMInformation.getDifficultyLevel();

        var query = "SELECT * from videoQCM where difficultyLevel = ?";
        $cordovaSQLite.execute(db, query, [$scope.difficultyLevel]).then(function(res) {
            if (res.rows.length > 0) {
                console.log("loadVideoQuestions : SELECTED -> " + res.rows.length);

                // Store each question in the list
                for (var i = 0; i < res.rows.length; i++) {
                    videoQCMList.push(res.rows.item(i));
                };

                $scope.updateVideoQCM();

            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    };

    // Load all the Sentences QCM questions with the corresponding difficulty level
    $scope.loadSentencesQuestions = function() {
        $scope.difficultyLevel = SharingQCMInformation.getDifficultyLevel();

        var query = "SELECT * from sentenceQCM where difficultyLevel = ?";
        $cordovaSQLite.execute(db, query, [$scope.difficultyLevel]).then(function(res) {
            if (res.rows.length > 0) {
                console.log("loadSentencesQuestions : SELECTED -> " + res.rows.length);

                // Store each question in the list
                for (var i = 0; i < res.rows.length; i++) {
                    sentenceQCMList.push(res.rows.item(i));
                };

                $scope.updateSentenceQCM();

            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    };

    $scope.searchURLByIDs = function(videoIDLSF, videoIDASL) {

        var query = "SELECT * FROM video WHERE id = ? OR id = ?";
        $cordovaSQLite.execute(db, query, [videoIDLSF, videoIDASL]).then(function(res) {
            if (res.rows.length == 2) {
                $scope.videoLSF = {};
                $scope.videoASL = {};

                console.log("searchYoutubeURLBySignIDs : SELECTED -> " + res.rows.length);

                for (var i = 0; i < 2; i++) {
                    switch (res.rows.item(i).id) {
                        case videoIDLSF:
                            $scope.videoLSF = res.rows.item(i);
                            break;
                        case videoIDASL:
                            $scope.videoASL = res.rows.item(i);
                            break;
                    }
                }

            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    };

    $scope.setDifficultyLevel = function(level) {
        SharingQCMInformation.setDifficultyLevel(level);
    };

    // Enable to trust the URL so Angular can load the corresponding template
    $scope.trustUrl = function(url) {
        return $sce.trustAsResourceUrl(url);
    };

    $scope.clickedSentenceQCM = function(userAnswer, videoIDLSF, videoIDASL) {
        document.getElementById("buttonSubmit-sentenceQCM").style.visibility = 'visible';
        document.getElementById("buttonSubmit-sentenceQCM").setAttribute('data-userAnswer', userAnswer);
        $scope.searchURLByIDs(videoIDLSF, videoIDASL)
    };

    $scope.submitSentenceQCMAnswer = function() {
        userAnswer = document.getElementById("buttonSubmit-sentenceQCM").getAttribute('data-userAnswer');
        // If the user had the good answer, tells him he is correct
        if (userAnswer == $scope.actualQuestion.goodAnswer) {
            document.getElementById("buttonResult-sentenceQCM").style.backgroundColor = "#2BBD2D";
            document.getElementById("QCMSentenceButtonAnswer" + $scope.actualQuestion.goodAnswer).style.backgroundColor = "#2BBD2D";
            document.getElementById("buttonResult-sentenceQCM").innerHTML = "Correct !";
        }
        // If he's Incorrect, tells him and show him the good answer
        else {
            document.getElementById("buttonResult-sentenceQCM").style.backgroundColor = "#C00000"
            document.getElementById("QCMSentenceButtonAnswer" + $scope.actualQuestion.goodAnswer).style.backgroundColor = "#2BBD2D";
            document.getElementById("QCMSentenceButtonAnswer" + userAnswer).style.backgroundColor = "#C00000";
            document.getElementById("buttonResult-sentenceQCM").innerHTML = "Incorrect !";
        }

        // Disable click on buttons
        $scope.buttonsDisabled = true;

        document.getElementById("buttonSubmit-sentenceQCM").style.visibility = 'hidden';
        document.getElementById("buttonResult-sentenceQCM").style.visibility = 'visible';
    }

});

app.controller("DataManagementController", function($scope, $sce, $ionicLoading, $http, $cordovaSQLite, $location, SharingSentenceQCMInformation) {

    $scope.youtubeURLArray = [];
    $scope.qcmList = [];



    $scope.insertSentenceQCMVideos = function(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer, callback) {
        var query = "INSERT INTO video (youtubeURL) values (?),(?),(?),(?),(?),(?),(?),(?)";
        $cordovaSQLite.execute(db, query, [videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL]).then(function(res) {
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId - 7));
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId - 6));
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId - 5));
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId - 4));
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId - 3));
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId - 2));
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId - 1));
            console.log("VideoSentenceQCM successfully added -> " + (res.insertId));
            return callback(difficultyLevel, frenchSentence, englishSentence, res.insertId - 7, res.insertId - 6, res.insertId - 5, res.insertId - 4, res.insertId - 3, res.insertId - 2, res.insertId - 1, res.insertId, goodAnswer);
        }, function(err) {
            console.error(err);
            return -1;
        });
    };


    $scope.insertSentenceQCM = function(difficultyLevel, frenchSentence, englishSentence, videoIDALSF, videoIDAASL, videoIDBLSF, videoIDBASL, videoIDCLSF, videoIDCASL, videoIDDLSF, videoIDDASL, goodAnswer) {
        var query = "INSERT INTO sentenceQCM (difficultyLevel, frenchSentence, englishSentence, videoIDALSF, videoIDAASL, videoIDBLSF, videoIDBASL, videoIDCLSF, videoIDCASL, videoIDDLSF, videoIDDASL, goodAnswer) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $cordovaSQLite.execute(db, query, [difficultyLevel, frenchSentence, englishSentence, videoIDALSF, videoIDAASL, videoIDBLSF, videoIDBASL, videoIDCLSF, videoIDCASL, videoIDDLSF, videoIDDASL, goodAnswer]).then(function(res) {

            console.log("Sentence successfully added -> " + res.insertId);

            return res.insertId;

        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.addQCM = function(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer) {
        //Appel à la méthode insert qcm
        // console.log(document.getElementById('QCMSentence-LSFVideoA').validity.valid)
        // console.log(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer)

        //A FAIRE: Gérer les champs sinon l'utilisateur pourra insérér n'importe quoi

        $scope.insertNewSentenceQCM(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer);
    }

    $scope.updateQCM = function(id, difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer) {
        console.log(id, difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer);
        console.log($scope.qcm);
        console.log("QCM LIST:");
        console.log($scope.qcmList);

        if (videoURLALSF != $scope.qcm.videoURLALSF) {
            var query = "UPDATE video SET youtubeURL = ? where ID = ?";
            $cordovaSQLite.execute(db, query, [videoURLALSF, $scope.qcm.videoIDALSF]);
        }
        if (videoURLAASL != $scope.qcm.videoURLAASL) {
            var query = "UPDATE video SET youtubeURL = ? where ID = ?";
            $cordovaSQLite.execute(db, query, [videoURLAASL, $scope.qcm.videoIDAASL]);
        }
        if (videoURLBLSF != $scope.qcm.videoURLBLSF) {
            var query = "UPDATE video SET youtubeURL = ? where ID = ?";
            $cordovaSQLite.execute(db, query, [videoURLBLSF, $scope.qcm.videoIDBLSF]);
        }
        if (videoURLBASL != $scope.qcm.videoURLBASL) {
            var query = "UPDATE video SET youtubeURL = ? where ID = ?";
            $cordovaSQLite.execute(db, query, [videoURLBASL, $scope.qcm.videoIDBASL]);
        }
        if (videoURLCLSF != $scope.qcm.videoURLCLSF) {
            var query = "UPDATE video SET youtubeURL = ? where ID = ?";
            $cordovaSQLite.execute(db, query, [videoURLCLSF, $scope.qcm.videoIDCLSF]);
        }
        if (videoURLCASL != $scope.qcm.videoURLCASL) {
            var query = "UPDATE video SET youtubeURL = ? where ID = ?";
            $cordovaSQLite.execute(db, query, [videoURLCASL, $scope.qcm.videoIDCASL]);
        }
        if (videoURLDLSF != $scope.qcm.videoURLDLSF) {
            var query = "UPDATE video SET youtubeURL = ? where ID = ?";
            $cordovaSQLite.execute(db, query, [videoURLDLSF, $scope.qcm.videoIDALSF]);
        }
        if (videoURLDASL != $scope.qcm.videoURLDASL) {
            var query = "UPDATE video SET youtubeURL = ? where ID = ?";
            $cordovaSQLite.execute(db, query, [videoURLDASL, $scope.qcm.videoIDDASL]);
        }
        var query = "UPDATE sentenceQCM set frenchSentence = ?, englishSentence = ?, difficultyLevel = ?, goodAnswer = ? where id = ?"
        $cordovaSQLite.execute(db, query, [frenchSentence, englishSentence, difficultyLevel, goodAnswer, id]);

        $location.path("/manage/sentenceQCM/list/");

    }

    /* Requêtes de recherches dans la table video */
    $scope.searchVideo = function(videoID, key, id) {
        var query = "SELECT * FROM video WHERE id = ?";
        $cordovaSQLite.execute(db, query, [videoID]).then(function(res) {
            if (res.rows.length > 0) {
                var obj = {};
                obj[key] = res.rows[0].youtubeURL;
                $scope.qcmList[id - 1][key] = res.rows[0].youtubeURL;
            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    };


    $scope.getAllSentenceQCMs = function() {
        var query = "SELECT * FROM sentenceQCM";
        $cordovaSQLite.execute(db, query).then(function(res) {
            if (res.rows.length > 0) {
                for (var i = 0; i < res.rows.length; ++i) {
                    var obj = {};
                    $scope.qcmList.push(res.rows[i]);
                }
            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    }

    $scope.fillSentenceQCM = function(id) {
        $scope.searchVideo($scope.qcmList[id - 1].videoIDALSF, "videoURLALSF", id);
        $scope.searchVideo($scope.qcmList[id - 1].videoIDAASL, "videoURLAASL", id);
        $scope.searchVideo($scope.qcmList[id - 1].videoIDBLSF, "videoURLBLSF", id);
        $scope.searchVideo($scope.qcmList[id - 1].videoIDBASL, "videoURLBASL", id);
        $scope.searchVideo($scope.qcmList[id - 1].videoIDCLSF, "videoURLCLSF", id);
        $scope.searchVideo($scope.qcmList[id - 1].videoIDCASL, "videoURLCASL", id);
        $scope.searchVideo($scope.qcmList[id - 1].videoIDDLSF, "videoURLDLSF", id);
        $scope.searchVideo($scope.qcmList[id - 1].videoIDDASL, "videoURLDASL", id);


        SharingSentenceQCMInformation.setSentenceQCM($scope.qcmList[id - 1]);
    }

    $scope.initEditQCM = function() {
        $scope.qcm = SharingSentenceQCMInformation.getSentenceQCM();
        console.log($scope.qcm);
        setTimeout(function() {
            $scope.frenchSentence = $scope.qcm.frenchSentence;
            $scope.englishSentence = $scope.qcm.englishSentence;
            $scope.difficultyLevelEdit = $scope.qcm.difficultyLevel;
            $scope.videoURLALSFEdit = $scope.qcm.videoURLALSF;
            $scope.videoURLAASLEdit = $scope.qcm.videoURLAASL;
            $scope.videoURLBLSFEdit = $scope.qcm.videoURLBLSF;
            $scope.videoURLBASLEdit = $scope.qcm.videoURLBASL;
            $scope.videoURLCLSFEdit = $scope.qcm.videoURLCLSF;
            $scope.videoURLCASLEdit = $scope.qcm.videoURLCASL;
            $scope.videoURLDLSFEdit = $scope.qcm.videoURLDLSF;
            $scope.videoURLDASLEdit = $scope.qcm.videoURLDASL;
            $scope.goodAnswerEdit = $scope.qcm.goodAnswer;
        }, 1000);

    }

    //Insert new Sentence QCM and all the corresponding information
    $scope.insertNewSentenceQCM = function(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer) {
        $scope.insertSentenceQCMVideos(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer, $scope.insertSentenceQCM);
    };
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

    $stateProvider.state('position-skeleton', {
        url: '/position-skeleton',
        templateUrl: 'templates/position-skeleton.html',
        controller: 'Skeleton'
    })

    $stateProvider.state('fr-search', {
        url: '/fr-search',
        templateUrl: 'templates/word-search.html',
        controller: 'WordSearch'
    })

    $stateProvider.state('asl-search', {
        url: '/asl-search',
        templateUrl: 'templates/asl-search.html',
        controller: 'ASLSearch'
    })

    $stateProvider.state('en-search', {
        url: '/en-search',
        templateUrl: 'templates/word-search.html',
        controller: 'WordSearch'
    })

    $stateProvider.state('word-selection', {
        url: '/word-selection',
        templateUrl: 'templates/word-selection.html',
        controller: 'WordSelection'
    })

    $stateProvider.state('word-presentation', {
        url: '/word/:id',
        templateUrl: 'templates/word-presentation.html',
        controller: 'WordPresentation'
    })

    $stateProvider.state('wording-presentation', {
        url: '/word/:id/wording/:number',
        templateUrl: 'templates/wording-presentation.html',
        controller: 'WordingPresentation'
    })

    $stateProvider.state('sign-explanation', {
        url: '/word/:id/explanations',
        templateUrl: 'templates/sign-explanation.html',
        controller: 'SignExplanation'
    })

    $stateProvider.state('dialog-list', {
        url: '/word/:id/dialogs/',
        templateUrl: 'templates/dialog-list.html',
        controller: 'DialogList'
    })

    $stateProvider.state('dialog-presentation', {
        url: '/word/:id/dialogs/:language/:number',
        templateUrl: 'templates/dialog-presentation.html',
        controller: 'DialogPresentation'
    })

    $stateProvider.state('qcm-difficulty-selection', {
        url: '/qcm',
        templateUrl: 'templates/qcm-difficulty-selection.html',
        controller: 'QCMController'
    })

    $stateProvider.state('qcm-video', {
        url: '/qcm/:difficulty/video',
        templateUrl: 'templates/qcm-video.html',
        controller: 'QCMController'
    })

    $stateProvider.state('qcm-sentence', {
        url: '/qcm/:difficulty/sentence',
        templateUrl: 'templates/qcm-sentence.html',
        controller: 'QCMController'
    })

    $stateProvider.state('data-management', {
        url: '/manage',
        templateUrl: 'templates/data-management.html',
        controller: 'DataManagementController'
    })

    $stateProvider.state('add-word', {
        url: '/manage/word/add',
        templateUrl: 'templates/add-word.html',
        controller: 'DataManagementController'
    })

    $stateProvider.state('edit-word', {
        url: '/manage/word/edit',
        templateUrl: 'templates/edit-word.html',
        controller: 'DataManagementController'
    })

    $stateProvider.state('delete-word', {
        url: '/manage/word/delete',
        templateUrl: 'templates/delete-word.html',
        controller: 'DataManagementController'
    })

    $stateProvider.state('add-sentence-qcm', {
        url: '/manage/sentenceQCM/add',
        templateUrl: 'templates/add-sentence-qcm.html',
        controller: 'DataManagementController'
    })


    $stateProvider.state('edit-sentence-qcm', {
        url: '/manage/sentenceQCM/edit/:id',
        templateUrl: 'templates/edit-sentence-qcm.html',
        controller: 'DataManagementController'
    })

    $stateProvider.state('list-sentence-qcm', {
        url: '/manage/sentenceQCM/list/',
        templateUrl: 'templates/list-sentence-qcm.html',
        controller: 'DataManagementController'
    })

    $stateProvider.state('delete-sentence-qcm', {
        url: '/manage/sentenceQCM/delete',
        templateUrl: 'templates/delete-sentence-qcm.html',
        controller: 'DataManagementController'
    })

    $stateProvider.state('add-video-qcm', {
        url: '/manage/videoQCM/add',
        templateUrl: 'templates/add-video-qcm.html',
        controller: 'DataManagementController'
    })

    $stateProvider.state('edit-video-qcm', {
        url: '/manage/videoQCM/edit',
        templateUrl: 'templates/edit-video-qcm.html',
        controller: 'DataManagementController'
    })

    $stateProvider.state('delete-video-qcm', {
        url: '/manage/videoQCM/delete',
        templateUrl: 'templates/delete-video-qcm.html',
        controller: 'DataManagementController'
    })

    $urlRouterProvider.otherwise('/home')

});
