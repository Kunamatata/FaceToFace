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
        } else {
            db = window.openDatabase("face.db", "1.0", "Dev Database", 200000); //To test in web browser with ionic serve
        }
        /* A RETIRER */
        /* A RETIRER */
        /* A RETIRER */
        /* A RETIRER */
        /* A RETIRER */
        /* A RETIRER */
        /* A RETIRER */
        /* A RETIRER */

        // $cordovaSQLite.execute(db, "DROP table word");
        // $cordovaSQLite.execute(db, "DROP table sign");
        // $cordovaSQLite.execute(db, "DROP table video");
        // $cordovaSQLite.execute(db, "DROP table wording");
        // $cordovaSQLite.execute(db, "DROP table configuration");
        // $cordovaSQLite.execute(db, "DROP table subtitle");
        // $cordovaSQLite.execute(db, "DROP table dialog");
        // $cordovaSQLite.execute(db, "DROP table genealogy");
        // $cordovaSQLite.execute(db, "DROP table videoQCM");
        // $cordovaSQLite.execute(db, "DROP table sentenceQCM");
        //$cordovaSQLite.execute(db, "DROP table position");
        // $cordovaSQLite.execute(db, "DROP table positionConfigurationSign");

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

    // $scope.insertNewSignExplanation(1, "Le signe-ancêtre commun, attesté pour la première fois en France en 1784 et importé aux USA au début du XXème siècle, comportait deux parties.", "There is a lot of interesting things to say about this sign.", "https://www.youtube.com/embed/87tCKyr5sa4", "https://www.youtube.com/embed/jP5-qP-LTE8");


    // $scope.insertNewWord("Racine", "Root", "https://www.youtube.com/embed/XQEFR5YmIP4", "https://www.youtube.com/embed/9IMWwkhv610");
    // $scope.insertNewWord("Rang", "Rank", "https://www.youtube.com/embed/-TBhtvoJFmM", "https://www.youtube.com/embed/1D0WPo2wTSA");

        // $scope.insertNewWording(1, "https://www.youtube.com/embed/60pdCwdN-kg", "https://www.youtube.com/embed/yhy19VUoKAY", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/9mp2E58UlR4");

        // $scope.insertNewDialog(1, 1, "https://www.youtube.com/embed/yhy19VUoKAY");

        // for (i = 0; i < 46; i++) {
        //     $scope.insertConfiguration(0, "../config_" + (i + 1) + ".jpg");
        // }

        // $scope.insertNewVideoQCM(1, "https://www.youtube.com/embed/9mp2E58UlR4", "https://www.youtube.com/embed/YVP6M2u2sf0", "Maybe", "Peut-être", "Not sure", "Pas sûr", "Oh yes", "Oh oui", "Cat", "Chat", "B");

        // $scope.insertNewSentenceQCM(1, "Bob est perdu dans toutes ces lignes de code", "Bob is lost in all those lines of code", "https://www.youtube.com/embed/QL8N4QcnpWE", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "B");

        // $scope.insertNewSentenceQCM(1, "Bob a nettoyé quelques lignes de codes et n'est plus autant perdu qu'avant.", "Bob cleaned some lines of codes and isn't as lost as before.", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/wZZ7oFKsKzY", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/wZZ7oFKsKzY", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/YVP6M2u2sf0", "A");

        // $scope.insertPosition(0, "mouth");
        // $scope.insertPosition(1, "chin");
        // $scope.insertPosition(2, "throat");
        // $scope.insertPosition(3, "cheek");
        // $scope.insertPosition(4, "temple");
        // $scope.insertPosition(5, "eyes");
        // $scope.insertPosition(6, "forehead");
        // $scope.insertPosition(7, "rightpectoral");
        // $scope.insertPosition(8, "leftpectoral");
        // $scope.insertPosition(9, "thorax");
        // $scope.insertPosition(10, "stomach");
        // $scope.insertPosition(11, "rightarm");
        // $scope.insertPosition(12, "rightforearm");
        // $scope.insertPosition(13, "rightelbow");
        // $scope.insertPosition(14, "handpalm");
        // $scope.insertPosition(15, "righthand");
        // $scope.insertPosition(16, "ear");
        // $scope.insertPosition(17, "armpit");
        // $scope.insertPosition(18, "wrist");
        // $scope.insertPosition(19, "tophead");
        // $scope.insertPosition(20, "chinneck");

        // //first configuration Mouth  first configuration Chin
        // $scope.insertPositionConfigurationSign(1, 1, 0, 1, 1);
        // $scope.insertPositionConfigurationSign(3, 1, 0, 1, 1);
        // $scope.insertPositionConfigurationSign(2, 2, 0, 1, 1);
        // $scope.insertPositionConfigurationSign(3, 1, 0);

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

app.factory("SharingVideoQCMInformation", function() {
    var qcm = {};
    return {
        getVideoQCM: function() {
            return qcm;
        },
        setVideoQCM: function(object) {
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
                title: 'You must choose a configuration at least for the active hand.',
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
            activeHandPosition['configurationID'] = $scope.activeHand.id;
        } else if (handDivID == "second-hand-picture" && $scope.passiveHand != null) {
            passiveHandPosition['src'] = $scope.passiveHand.src;
            passiveHandPosition['configurationID'] = $scope.passiveHand.id;
        }
        currentSelectedHand = handDivID;
    };

    $scope.setPosition = function(positionName, positionID) {
        if (activeHandPosition['src'] != null && activeHandPosition['configurationID'] != null && currentSelectedHand == "first-hand-picture") {
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
                title: 'Aucun mot ou signe ne correspond à la combinaison de configurations et de positions données !',
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
            $scope.otherWordingName = "Second Wording";
            $scope.otherWordingNumber = 2;
        } else {
            $scope.otherWordingName = "First Wording";
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

app.controller("DataManagementController", function($scope, $sce, $ionicLoading, $ionicPopup, $http, $cordovaSQLite, $state, $location, $sce, SharingSentenceQCMInformation, SharingVideoQCMInformation, SharingWordInformation) {


    /**********************
    Variables to add a word
    **********************/
    $scope.images = [];
    $scope.selectedHand = "";
    $scope.selectedConfigurationsLSF = [null, null];
    $scope.selectedConfigurationsASL = [null, null]
    $scope.youtubeURLArray = [];
    $scope.qcmList = [];
    $scope.words = [];


    // Trust the URL so Angular can load the corresponding template
    $scope.trustUrl = function(url) {
        return $sce.trustAsResourceUrl(url);
    };

    $scope.getAllWords = function() {
        var query = "SELECT * from word";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if (res.rows.length > 0) {

                for (var i = 0; i < res.rows.length; i++) {
                    $scope.words.push(res.rows[i]);
                }

            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.deleteSign = function(id) {
        var query = "SELECT videoID from sign WHERE id = ?";
        $cordovaSQLite.execute(db, query, [id]).then(function(res) {
            if (res.rows.length > 0) {
                query = "DELETE FROM video WHERE id = ?";
                $cordovaSQLite.execute(db, query, [res.rows[0].id]);
            }

            query = "DELETE FROM sign WHERE id = ?";
            $cordovaSQLite.execute(db, query, [id]);

        }, function(err) {
            console.error(err);
            return -1;
        });
    };


    $scope.deleteWord = function(id, index) {
        $scope.deleteSign($scope.words[index].idSignLSF);
        $scope.deleteSign($scope.words[index].idSignASL);

        query = "DELETE FROM word WHERE id = ?";
        $cordovaSQLite.execute(db, query, [id]);

        query = "DELETE FROM dialog WHERE wordID = ?";
        $cordovaSQLite.execute(db, query, [id]);

        query = "DELETE FROM wording WHERE wordID = ?";
        $cordovaSQLite.execute(db, query, [id]);

        query = "DELETE FROM SignExplanation WHERE wordID = ?";
        $cordovaSQLite.execute(db, query, [id]);

        query = "DELETE FROM PositionConfigurationSign WHERE id = ? OR id = ?";
        $cordovaSQLite.execute(db, query, [$scope.words[index].idSignLSF, $scope.words[index].idSignASL]);

        $scope.words.splice(index, 1);
    };

    $scope.searchSignVideos = function(idLSF, idASL, index)
    {
        var query = "SELECT youtubeURL FROM video WHERE id = ? OR id = ?";
        $cordovaSQLite.execute(db, query, [idLSF, idASL]).then(function(res) {
            if (res.rows.length > 0) {

                for(var i = 0; i < res.rows.length; i++)
                {
                    switch(res.rows[i].signID)
                    {
                        case idLSF :
                            $scope.words[index].signLSF.configuration = res.rows[i];
                            break;
                        case idASL :
                            $scope.words[index].signASL.configuration = res.rows[i];
                            break;
                    }
                }
            }
        })
    };

    $scope.searchPositionConfigurationSign = function(idLSF, idASL, index)
    {
        var query = "SELECT * FROM positionConfigurationSign WHERE signID = ? or signID = ?";
        $cordovaSQLite.execute(db, query, [idLSF, idASL]).then(function(res) {
            if (res.rows.length > 0) {

                for(var i = 0; i < res.rows.length; i++)
                {
                    switch(res.rows[i].id)
                    {
                        case idLSF :
                            $scope.words[index].signLSF.youtubeURL = res.rows[i].youtubeURL;
                            break;
                        case idASL :
                            $scope.words[index].signASL.youtubeURL = res.rows[i].youtubeURL;
                            break;
                    }
                }
            }
        })
    };

    $scope.searchSigns = function(index)
    {
        var query = "SELECT * FROM sign WHERE id = ? or id = ?";
        $cordovaSQLite.execute(db, query, [$scope.words[index].idSignLSF, $scope.words[index].idSignASL]).then(function(res) {
            if (res.rows.length > 0) {

                for(var i = 0; i < res.rows.length; i++)
                {
                    switch(res.rows[i].id)
                    {
                        case $scope.words[index].idSignLSF :
                            $scope.words[index].signLSF = res.rows[i];
                            break;
                        case $scope.words[index].idSignASL:
                            $scope.words[index].signASL = res.rows[i]
                            break;
                    }

                    $scope.searchSignVideos($scope.words[index].signLSF.videoID, $scope.words[index].signASL.videoID, index);
                    $scope.searchPositionConfigurationSign($scope.words[index].idSignLSF, $scope.words[index].idSignASL, index);
                }

            }
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.searchWordingVideo = function(idLSF, idASL, wordIndex, wordingIndex)
    {
        var query = "SELECT youtubeURL FROM video WHERE id = ? OR id = ?";
        $cordovaSQLite.execute(db, query, [idLSF, idASL]).then(function(res) {
            if (res.rows.length > 0) {

                for(var i = 0; i < res.rows.length; i++)
                {
                    switch(res.rows[i].id)
                    {
                        case idLSF :
                            $scope.words[wordIndex].wordings[wordingIndex].youtubeURLLSF = res.rows[i].youtubeURL;
                            break;
                        case idASL :
                            $scope.words[wordIndex].wordings[wordingIndex].youtubeURLASL = res.rows[i].youtubeURL;
                            break;
                    }
                }
            }
        })
    };

    $scope.searchWordings = function(index)
    {
        var query = "SELECT * FROM wording WHERE wordID = ?";
        $cordovaSQLite.execute(db, query, [$scope.words[index].idSignLSF]).then(function(res) {
            if (res.rows.length > 0) {

                $scope.words[i].wordings = [];

                for(var i = 0; i < res.rows.length; i++)
                {
                    $scope.words[i].wordings[i] = res.rows[i];

                    $scope.searchWordingVideo(res.rows[i].videoIDLSF, res.rows[i].videoIDASL, index, i);
                }
            }
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.searchDialogVideo = function(idLSF, idASL, wordIndex, dialogIndex)
    {
        var query = "SELECT youtubeURL FROM video WHERE id = ? OR id = ?";
        $cordovaSQLite.execute(db, query, [idLSF, idSL]).then(function(res) {
            if (res.rows.length > 0) {

                for(var i = 0; i < res.rows.length; i++)
                {
                    switch(res.rows[i].id)
                    {
                        case idLSF :
                            $scope.words[wordIndex].dialogs[dialogIndex].youtubeURLLSF = res.rows[i].youtubeURL;
                            break;
                        case idASL :
                            $scope.words[wordIndex].dialogs[dialogIndex].youtubeURLASL = res.rows[i].youtubeURL;
                            break;
                    }
                }
            }
        })
    };

    $scope.searchDialogs = function(index)
    {
        var query = "SELECT * FROM dialog WHERE wordID = ?";
        $cordovaSQLite.execute(db, query, [$scope.words[index].wordID]).then(function(res) {
            if (res.rows.length > 0) {

                $scope.words[i].dialogs = [];

                for(var i = 0; i < res.rows.length; i++)
                {
                    $scope.words[index].dialogs[i] = res.rows[i];

                    $scope.searchDialogVideo(res.rows[i].videoIDLSF, res.rows[i].videoIDASL, index, i);
                }
            }
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.searchSignExplanationVideos = function(idLSF, idASL, index)
    {
        var query = "SELECT youtubeURL FROM video WHERE id = ? or id = ?";
        $cordovaSQLite.execute(db, query, [idLSF, idASL]).then(function(res) {
            if (res.rows.length > 0) {

                for(var i = 0; i < res.rows.length; i++)
                {
                    switch(res.rows[i].id)
                    {
                        case idLSF :
                            $scope.words[index].signExplanation.youtubeURLLSF = res.rows[i].youtubeURL;
                            break;
                        case idASL :
                            $scope.words[index].signExplanation.youtubeURLASL = res.rows[i].youtubeURL;
                            break;
                    }
                }
            }
        })
    };

    $scope.searchSignExplanations = function(index)
    {
        var query = "SELECT * FROM signExplanation WHERE wordID = ?";
        $cordovaSQLite.execute(db, query, [$scope.words[index].wordID]).then(function(res) {
            if (res.rows.length > 0) {

                    $scope.words[index].signExplanation = res.rows[0];

                    $scope.searchSignExplanationsVideos(res.rows[0].videoIDLSFExplanation, res.rows[0].videoIDASLExplanation, index);
                }
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.fillWord = function(index)
    {
        $scope.searchSigns(index);
        $scope.searchWordings(index);
        $scope.searchDialogs(index);
        $scope.searchSignExplanation(index);

        SharingWordInformation.setWord($scope.words[index]);
    };

    $scope.initWordEdition = function()
    {
        $scope.word = SharingWordInformation.getWord();

        setTimeout(function() {
            $scope.signLSF = $scope.word.signLSF;
            $scope.signASL = $scope.word.signASL;
        }, 1000);
    };

    $scope.updateWord = function(frenchWordEdit,englishWordEdit, videoURLLSFEdit, videoURLASLEdit, wordingLSF1Edit, wordingASL1Edit, wordingLSF2Edit, wordingASL2Edit, signExplanationFrenchEdit, signExplanationEnglishEdit, signExplanationLSFEdit, signExplanationASLEdit)
    {
        if(frenchWordEdit != $scope.word.frenchWord)
        {
            var query = "UPDATE word SET frenchWord = ? where id = ?";
            $cordovaSQLite.execute(db, query, [frenchWordEdit, $scope.word.id]);
        }
        if(englishWordEdit != $scope.word.englishWord)
        {
            var query = "UPDATE word SET englishWord = ? where id = ?";
            $cordovaSQLite.execute(db, query, [englishWordEdit, $scope.word.id]);
        }
        if(videoURLLSFEdit != $scope.word.signLSF.youtubeURL)
        {
            if($scope.word.signLSF.youtubeURL == "undefined")
            {
                var query = "INSERT INTO video(youtubeURL) VALUES (?)";
                $cordovaSQLite.execute(db, query, [videoURLLSFEdit]);
            }
            else
            {
                var query = "UPDATE video SET youtubeURL = ? where id = ?";
                $cordovaSQLite.execute(db, query, [videoURLLSFEdit, $scope.word.signLSF.videoID]);
            }
        }
        if(videoURLASLEdit != $scope.word.signASL.youtubeURL)
        {
            if($scope.word.signASL.youtubeURL == "undefined")
            {
                var query = "INSERT INTO video(youtubeURL) VALUES (?)";
                $cordovaSQLite.execute(db, query, [videoURLASLEdit]);
            }
            else
            {
                var query = "UPDATE video SET youtubeURL = ? where id = ?";
                $cordovaSQLite.execute(db, query, [videoURLASLEdit, $scope.word.signASL.videoID]);
            }
        }
        if(wordingLSF1Edit != $scope.word.wordings[0].youtubeURLLSF)
        {
            if($scope.word.wordings[0].youtubeURLLSF == "undefined")
            {
                var query = "INSERT INTO video(youtubeURL) VALUES (?)";
                $cordovaSQLite.execute(db, query, [wordingLSF1Edit]).then(function(res) {
                    var secondQuery = "INSERT INTO wording(wordID, videoIDLSF) VALUES (?, ?)";
                    $cordovaSQLite.execute(db, secondQuery, [$scope.word.id, res.insertId])
                });
            }
            else
            {
                var query = "UPDATE video SET youtubeURL = ? where id = ?";
                $cordovaSQLite.execute(db, query, [wordingLSF1Edit, $scope.word.wordings[0].videoIDLSF]);
            }
        }
        if(wordingLSF2Edit != $scope.word.wordings[1].youtubeURLLSF)
        {
            if($scope.word.wordings[1].youtubeURLLSF == "undefined")
            {
                var query = "INSERT INTO video(youtubeURL) VALUES (?)";
                $cordovaSQLite.execute(db, query, [wordingLSF2Edit]).then(function(res) {
                    var secondQuery = "INSERT INTO wording(wordID, videoIDLSF) VALUES (?, ?)";
                    $cordovaSQLite.execute(db, secondQuery, [$scope.word.id, res.insertId])
                });
            }
            else
            {
                var query = "UPDATE video SET youtubeURL = ? where id = ?";
                $cordovaSQLite.execute(db, query, [wordingLSF2Edit, $scope.word.wordings[1].videoIDLSF]);
            }
        }
        if(wordingASL1Edit != $scope.word.wordings[0].youtubeURLASL)
        {
            if($scope.word.wordings[0].youtubeURLASL == "undefined")
            {
                var query = "INSERT INTO video(youtubeURL) VALUES (?)";
                $cordovaSQLite.execute(db, query, [wordingASL1Edit]).then(function(res) {
                    var query = "UPDATE wording SET videoIDASL = ? WHERE wordID = ?";
                    $cordovaSQLite.execute(db, query, [res.insertId, $scope.word.id])
                });
            }
            else
            {
                var query = "UPDATE video SET youtubeURL = ? where id = ?";
                $cordovaSQLite.execute(db, query, [wordingASL1Edit, $scope.word.wordings[0].videoIDASL]);
            }
        }
        if(wordingASL2Edit != $scope.word.wordings[1].youtubeURLASL)
        {
            if($scope.word.wordings[1].youtubeURLASL == "undefined")
            {
                var query = "INSERT INTO video(youtubeURL) VALUES (?)";
                $cordovaSQLite.execute(db, query, [wordingASL2Edit]).then(function(res) {
                    var query = "UPDATE wording SET videoIDASL = ? WHERE wordID = ?";
                    $cordovaSQLite.execute(db, query, [res.insertId, $scope.word.id])
                });
            }
            else
            {
                var query = "UPDATE video SET youtubeURL = ? where id = ?";
                $cordovaSQLite.execute(db, query, [wordingASL2Edit, $scope.word.wordings[1].videoIDASL]);
            }
        }
        if(signExplanationFrenchEdit != $scope.word.signExplanation.frenchExplanation)
        {
            if($scope.word.signExplanation == "undefined")
            {
                var query = "INSERT INTO signExplanation(frenchExplanation, englishExplanation, videoIDLSFExplanation, videoIDASLExplanation) VALUES (?)";
                $cordovaSQLite.execute(db, query, [signExplanationFrenchEdit]);
            }
            else
            {
                var query = "UPDATE signExplanation SET frenchExplanation = ? where id = ?";
                $cordovaSQLite.execute(db, query, [signExplanationFrenchEdit, $scope.word.signExplanation.id]);
            }
        }
        if(signExplanationEnglishEdit != $scope.word.signExplanation.englishExplanation)
        {
            var query = "UPDATE signExplanation SET englishExplanation = ? where id = ?";
            $cordovaSQLite.execute(db, query, [signExplanationEnglishEdit, $scope.word.signExplanation.id]);
        }
        if(signExplanationLSFEdit != $scope.word.signExplanation.youtubeURLLSF)
        {
            var query = "UPDATE video SET youtubeURL = ? where id = ?";
            $cordovaSQLite.execute(db, query, [signExplanationLSFEdit, $scope.word.signExplanation.videoIDLSFExplanation]);
        }
        if(signExplanationASLEdit != $scope.word.signExplanation.youtubeURLASL)
        {
            var query = "UPDATE video SET youtubeURL = ? where id = ?";
            $cordovaSQLite.execute(db, query, [signExplanationASLEdit, $scope.word.signExplanation.videoIDASLExplanation]);
        }
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



    $scope.addSentenceQCM = function(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer) {
        //Appel à la méthode insert qcm
        // console.log(document.getElementById('QCMSentence-LSFVideoA').validity.valid)
        // console.log(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer)

        //A FAIRE: Gérer les champs sinon l'utilisateur pourra insérér n'importe quoi

        $scope.insertNewSentenceQCM(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer);

        $scope.getAllSentenceQCMs();
        $state.go("list-sentence-qcm");
    };

    $scope.addVideoQCM = function(difficultyLevel, videoURLLSF, videoURLASL, englishSentenceA, frenchSentenceA, englishSentenceB, frenchSentenceB, englishSentenceC, frenchSentenceC, englishSentenceD, frenchSentenceD, goodAnswer) {
        //Appel à la méthode insert qcm
        // console.log(document.getElementById('QCMSentence-LSFVideoA').validity.valid)
        // console.log(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer)

        //A FAIRE: Gérer les champs sinon l'utilisateur pourra insérér n'importe quoi

        $scope.insertNewVideoQCM(difficultyLevel, videoURLLSF, videoURLASL, englishSentenceA, frenchSentenceA, englishSentenceB, frenchSentenceB, englishSentenceC, frenchSentenceC, englishSentenceD, frenchSentenceD, goodAnswer);
        $scope.getAllVideoQCMs();
        $state.go("list-video-qcm");
    }

    $scope.updateSentenceQCM = function(id, difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer) {
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
        $cordovaSQLite.execute(db, query, [frenchSentence, englishSentence, difficultyLevel, goodAnswer, id]).then(function() {
            $state.go("list-sentence-qcm");
        });



    };

    $scope.updateVideoQCM = function(id, difficultyLevel, videoURLLSF, videoURLASL, englishSentenceA, frenchSentenceA, englishSentenceB, frenchSentenceB, englishSentenceC, frenchSentenceC, englishSentenceD, frenchSentenceD, goodAnswer) {
        if (videoURLLSF != $scope.qcm.videoURLLSF) {
            var query = "UPDATE video SET youtubeURL = ? where ID = ?";
            $cordovaSQLite.execute(db, query, [videoURLLSF, $scope.qcm.videoIDLSF]);
        }
        if (videoURLASL != $scope.qcm.videoURLASL) {
            var query = "UPDATE video SET youtubeURL = ? where ID = ?";
            $cordovaSQLite.execute(db, query, [videoURLASL, $scope.qcm.videoIDASL]);
        }

        var query = "UPDATE videoQCM set frenchSentenceA = ?, englishSentenceA = ?,frenchSentenceB = ?, englishSentenceB = ?,frenchSentenceC = ?, englishSentenceC = ?,frenchSentenceD = ?, englishSentenceD = ?, difficultyLevel = ?, goodAnswer = ? where id = ?"
        $cordovaSQLite.execute(db, query, [frenchSentenceA, englishSentenceA, frenchSentenceB, englishSentenceB, frenchSentenceC, englishSentenceC, frenchSentenceD, englishSentenceD, difficultyLevel, goodAnswer, id]);

        $state.go("list-video-qcm");

    };

    /* Requêtes de recherches dans la table video */
    $scope.searchVideo = function(videoID, key, id) {
        var query = "SELECT * FROM video WHERE id = ?";
        $cordovaSQLite.execute(db, query, [videoID]).then(function(res) {
            if (res.rows.length > 0) {
                var obj = {};
                obj[key] = res.rows[0].youtubeURL;
                $scope.qcmList[id][key] = res.rows[0].youtubeURL;
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
                    console.log(res.rows[i]);
                }
            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    }


    $scope.getAllVideoQCMs = function() {
        var query = "SELECT * FROM videoQCM";
        $cordovaSQLite.execute(db, query).then(function(res) {
            if (res.rows.length > 0) {
                for (var i = 0; i < res.rows.length; ++i) {
                    var obj = {};
                    $scope.qcmList.push(res.rows[i]);
                    console.log($scope.qcmList);
                    $scope.searchVideo($scope.qcmList[i]['videoIDLSF'], "videoURLLSF", i);
                    $scope.searchVideo($scope.qcmList[i]['videoIDASL'], "videoURLASL", i);

                }
                $scope.youtubeURL
            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    }

    $scope.fillVideoQCM = function(index) {
        SharingVideoQCMInformation.setVideoQCM($scope.qcmList[index]);
    }


    $scope.fillSentenceQCM = function(index) {
        $scope.searchVideo($scope.qcmList[index].videoIDALSF, "videoURLALSF", index);
        $scope.searchVideo($scope.qcmList[index].videoIDAASL, "videoURLAASL", index);
        $scope.searchVideo($scope.qcmList[index].videoIDBLSF, "videoURLBLSF", index);
        $scope.searchVideo($scope.qcmList[index].videoIDBASL, "videoURLBASL", index);
        $scope.searchVideo($scope.qcmList[index].videoIDCLSF, "videoURLCLSF", index);
        $scope.searchVideo($scope.qcmList[index].videoIDCASL, "videoURLCASL", index);
        $scope.searchVideo($scope.qcmList[index].videoIDDLSF, "videoURLDLSF", index);
        $scope.searchVideo($scope.qcmList[index].videoIDDASL, "videoURLDASL", index);


        SharingSentenceQCMInformation.setSentenceQCM($scope.qcmList[index]);
    }

    $scope.initEditSentenceQCM = function() {
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

    };

    $scope.initEditVideoQCM = function() {
        $scope.qcm = SharingVideoQCMInformation.getVideoQCM();
        console.log("QCM VIDEO:");
        console.log($scope.qcm);
        $scope.difficultyLevelEdit = $scope.qcm.difficultyLevel;
        $scope.englishSentenceAEdit = $scope.qcm.englishSentenceA;
        $scope.englishSentenceBEdit = $scope.qcm.englishSentenceB;
        $scope.englishSentenceCEdit = $scope.qcm.englishSentenceC;
        $scope.englishSentenceDEdit = $scope.qcm.englishSentenceD;
        $scope.frenchSentenceAEdit = $scope.qcm.frenchSentenceA;
        $scope.frenchSentenceBEdit = $scope.qcm.frenchSentenceB;
        $scope.frenchSentenceCEdit = $scope.qcm.frenchSentenceC;
        $scope.frenchSentenceDEdit = $scope.qcm.frenchSentenceD;
        $scope.videoURLLSFEdit = $scope.qcm.videoURLASL;
        $scope.videoURLASLEdit = $scope.qcm.videoURLLSF;
        $scope.goodAnswerEdit = $scope.qcm.goodAnswer;
    };

    //Insert new Sentence QCM and all the corresponding information
    $scope.insertNewSentenceQCM = function(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer) {
        $scope.insertSentenceQCMVideos(difficultyLevel, frenchSentence, englishSentence, videoURLALSF, videoURLAASL, videoURLBLSF, videoURLBASL, videoURLCLSF, videoURLCASL, videoURLDLSF, videoURLDASL, goodAnswer, $scope.insertSentenceQCM);
    };


    var deleteVideoFromQCMQuery = function(videoID) {
        var query = "DELETE from video where id = ?";
        $cordovaSQLite.execute(db, query, [videoID]).then(function(res) {
            if (res.rows.length > 0) {
                console.log(res.rows);
            } else {
                console.log("No delete corresponding to the ID found");
            }
        }, function(err) {
            console.error(err);
        });
    }

    var deleteSentenceQCMQuery = function(qcmID, index) {
        var query = "SELECT * FROM sentenceQCM WHERE id = ?";
        $cordovaSQLite.execute(db, query, [qcmID]).then(function(res) {
            if (res.rows.length > 0) {
                deleteVideoFromQCMQuery(res.rows[0].videoIDAASL);
                deleteVideoFromQCMQuery(res.rows[0].videoIDALSF);
                deleteVideoFromQCMQuery(res.rows[0].videoIDBASL);
                deleteVideoFromQCMQuery(res.rows[0].videoIDBLSF);
                deleteVideoFromQCMQuery(res.rows[0].videoIDCASL);
                deleteVideoFromQCMQuery(res.rows[0].videoIDCLSF);
                deleteVideoFromQCMQuery(res.rows[0].videoIDDASL);
                deleteVideoFromQCMQuery(res.rows[0].videoIDDLSF);
                query = "DELETE FROM sentenceQCM WHERE id = ?";
                $cordovaSQLite.execute(db, query, [qcmID])
                $scope.qcmList.splice(index, 1);
            } else {
                console.log("No delete corresponding to the ID found");
            }
        }, function(err) {
            console.error(err);
        });
    };


    //Delete QCM with id
    $scope.deleteSentenceQCM = function(qcmID, index) {
        //Display alert message
        $ionicPopup.confirm({
            title: 'Voulez vous vraiment supprimer le QCM :' + qcmID,
            cssClass: 'alert-popup',
            cancelText: 'Annuler',
            okText: 'Oui'
        }).then(function(res) {
            //If res == true then ok button was pressed, else false
            if (res === true)
                deleteSentenceQCMQuery(qcmID, index);
        });
    };

    var deleteVideoQCMQuery = function(qcmID, index) {
        var query = "SELECT * FROM videoQCM WHERE id = ?";
        $cordovaSQLite.execute(db, query, [qcmID]).then(function(res) {
            if (res.rows.length > 0) {
                console.log(res.rows);
                deleteVideoFromQCMQuery(res.rows[0].videoIDASL);
                deleteVideoFromQCMQuery(res.rows[0].videoIDLSF);
                query = "DELETE FROM videoQCM WHERE id = ?";
                $cordovaSQLite.execute(db, query, [qcmID])
                $scope.qcmList.splice(index, 1);
            } else {
                console.log("No delete corresponding to the ID found");
            }
        }, function(err) {
            console.error(err);
        });
    };

    $scope.deleteVideoQCM = function(qcmID, index) {
        //Display alert message
        $ionicPopup.confirm({
            title: 'Voulez vous vraiment supprimer le QCM :' + qcmID,
            cssClass: 'alert-popup',
            cancelText: 'Annuler',
            okText: 'Oui'
        }).then(function(res) {
            //If res == true then ok button was pressed, else false
            if (res === true)
                deleteVideoQCMQuery(qcmID, index);
        });
    };

    /************************************
    Add a Word
    ************************************/

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
        console.log($scope.selectedHand);
        if (handDivisionID == "first-hand-picture-lsf" && $scope.selectedConfigurationsLSF[0] != null)
            $scope.activateSkeletonSelection(handDivisionID);
        else if (handDivisionID == "second-hand-picture-lsf" && $scope.selectedConfigurationsLSF[1] != null)
            $scope.activateSkeletonSelection(handDivisionID);
        else if (handDivisionID == "first-hand-picture-asl" && $scope.selectedConfigurationsASL[0] != null)
            $scope.activateSkeletonSelection(handDivisionID);
        else if (handDivisionID == "second-hand-picture-asl" && $scope.selectedConfigurationsASL[1] != null)
            $scope.activateSkeletonSelection(handDivisionID);
    };

    $scope.configurationSelected = function(image) {
        if ($scope.selectedHand != "") {
            //Check if selectedHand is the first or second to insert correctly in the array
            if ($scope.selectedHand == "first-hand-picture-lsf")
                $scope.selectedConfigurationsLSF[0] = image;
            else if ($scope.selectedHand == "second-hand-picture-lsf")
                $scope.selectedConfigurationsLSF[1] = image;
            else if ($scope.selectedHand == "first-hand-picture-asl")
                $scope.selectedConfigurationsASL[0] = image;
            else if ($scope.selectedHand == "second-hand-picture-asl")
                $scope.selectedConfigurationsASL[1] = image;

            console.log($scope.selectedConfigurationsLSF);
            console.log($scope.selectedConfigurationsASL);

            document.getElementById($scope.selectedHand).style = "background-image: url(" + image.src + ");";

            $scope.selectedHand = "";

        }
    };

    $scope.deleteChosenConfiguration = function(handDivisionID) {
        if (handDivisionID == "first-hand-picture-lsf")
            $scope.selectedConfigurationsLSF[0] = null;
        else if (handDivisionID == "second-hand-picture-lsf")
            $scope.selectedConfigurationsLSF[1] = null;
        else if (handDivisionID == "first-hand-picture-asl")
            $scope.selectedConfigurationsASL[0] = null;
        else if (handDivisionID == "second-hand-picture-asl")
            $scope.selectedConfigurationsASL[1] = null;

        console.log($scope.selectedConfigurationsLSF);
        console.log($scope.selectedConfigurationsASL);

        document.getElementById(handDivisionID).style = "background-image: url('../img/hand.png');";
    };

    var activeHandPositionLSF = {};
    var passiveHandPositionLSF = {};
    var activeHandPositionASL = {};
    var passiveHandPositionASL = {};
    var currentSelectedHand = "";

    var possibleWordList = [];

    $scope.activateSkeletonSelection = function(handDivID) {
        if (handDivID == "first-hand-picture-lsf") {
            activeHandPositionLSF['src'] = $scope.selectedConfigurationsLSF[0].src;
            activeHandPositionLSF['configurationID'] = $scope.selectedConfigurationsLSF[0].id;
        } else if (handDivID == "second-hand-picture-lsf" && $scope.selectedConfigurationsLSF[1] != null) {
            passiveHandPositionLSF['src'] = $scope.selectedConfigurationsLSF[1].src;
            passiveHandPositionLSF['configurationID'] = $scope.selectedConfigurationsLSF[1].id;
        } else if (handDivID == "first-hand-picture-asl") {
            activeHandPositionASL['src'] = $scope.selectedConfigurationsASL[0].src;
            activeHandPositionASL['configurationID'] = $scope.selectedConfigurationsASL[0].id;
        } else if (handDivID == "second-hand-picture-asl") {
            passiveHandPositionASL['src'] = $scope.selectedConfigurationsASL[1].src;
            passiveHandPositionASL['configurationID'] = $scope.selectedConfigurationsASL[1].id;
        }
        currentSelectedHand = handDivID;
    };

    //Language can either be LSF or ASL
    $scope.setPosition = function(positionName, positionID, language) {
        if (language == "LSF")
            if (activeHandPositionLSF['src'] != null && activeHandPositionLSF['configurationID'] != null && currentSelectedHand == "first-hand-picture-lsf") {
                if (activeHandPositionLSF['position']) {
                    document.getElementsByClassName(activeHandPositionLSF['position'])[0].style.backgroundColor = "red";
                }
                activeHandPositionLSF['position'] = positionName;
                activeHandPositionLSF['positionID'] = positionID;
                document.getElementById(positionName + "-lsf").style.backgroundColor = "#00FF0C";
                console.log(activeHandPositionLSF);
            } else {
                if (passiveHandPositionLSF['position']) {
                    document.getElementById(passiveHandPositionLSF['position'] + "-lsf").style.backgroundColor = "red";
                }
                passiveHandPositionLSF['position'] = positionName
                passiveHandPositionLSF['positionID'] = positionID;
                document.getElementById(positionName + "-lsf").style.backgroundColor = "#00FF0C";
                console.log(passiveHandPositionLSF);
            }
        else if (language == "ASL") {
            if (activeHandPositionASL['src'] != null && activeHandPositionASL['configurationID'] != null && currentSelectedHand == "first-hand-picture-asl") {

                if (activeHandPositionASL['position']) {
                    document.getElementById(activeHandPositionASL['position'] + "-asl").style.backgroundColor = "red";
                }
                activeHandPositionASL['position'] = positionName;
                activeHandPositionASL['positionID'] = positionID;
                document.getElementById(positionName + "-asl").style.backgroundColor = "#00FF0C";
                console.log(activeHandPositionASL);
            } else {
                if (passiveHandPositionASL['position']) {
                    document.getElementById(passiveHandPositionASL['position'] + "-asl").style.backgroundColor = "red";
                }
                passiveHandPositionASL['position'] = positionName
                passiveHandPositionASL['positionID'] = positionID;
                document.getElementById(positionName + "-asl").style.backgroundColor = "#00FF0C";
                console.log(passiveHandPositionASL);
            }
        }
    };



    // Insert a new word and all the corresponding information (first insert videos, then signs, then the word)
    $scope.insertNewWord = function(frenchWord, englishWord, frenchYoutubeURL, englishYoutubeURL) {
        console.log(englishWord);
        var answer = insertNewWordVideos(frenchWord, englishWord, frenchYoutubeURL, englishYoutubeURL, insertNewWordSigns);
    };

    var insertNewWordVideos = function(frenchWord, englishWord, frenchYoutubeURL, englishYoutubeUrl, callback) {
        var query = "INSERT INTO video (youtubeURL) values (?),(?)";
        $cordovaSQLite.execute(db, query, [frenchYoutubeURL, englishYoutubeUrl]).then(function(res) {
            console.log("Videos successfully added -> " + res.insertId);
            return callback(frenchWord, englishWord, res.insertId - 1, res.insertId, insertWord);
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    var insertPositionConfigurationSign = function(signID, configurationIDDominating, positionIDDominating, configurationIDDominated, positionIDDominated) {
        var query = "INSERT INTO positionConfigurationSign (signID, configurationIDDominating, positionIDDominating, configurationIDDominated, positionIDDominated) values(?, ?, ?, ?, ?)";
        $cordovaSQLite.execute(db, query, [signID, configurationIDDominating, positionIDDominating, configurationIDDominated, positionIDDominated]).then(function(res) {
            console.log("Position Configuration Sign successfully added -> " + res.insertId + " " + signID);
            return res.insertId;
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    var insertNewWordSigns = function(frenchWord, englishWord, idFrenchVideo, idEnglishVideo, callback) {
        var query = "INSERT INTO sign (language, videoID) VALUES(0, ?),(1, ?)";
        $cordovaSQLite.execute(db, query, [idFrenchVideo, idEnglishVideo]).then(function(res) {
            console.log("Signs successfully added -> " + res.insertId);
            insertPositionConfigurationSign(res.insertId, activeHandPositionLSF['configurationID'], activeHandPositionLSF['positionID'], passiveHandPositionLSF['configurationID'], passiveHandPositionLSF['positionID']);
            insertPositionConfigurationSign(res.insertId, activeHandPositionASL['configurationID'], activeHandPositionASL['positionID'], passiveHandPositionASL['configurationID'], passiveHandPositionASL['positionID']);

            return callback(frenchWord, englishWord, res.insertId - 1, res.insertId);
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    var insertWord = function(frenchWord, englishWord, idFrenchSign, idEnglishSign) {
        var query = "INSERT INTO word (frenchWord, englishWord, signIDLSF, signIDASL) values(?, ?, ?, ?)";
        $cordovaSQLite.execute(db, query, [frenchWord, englishWord, idFrenchSign, idEnglishSign]).then(function(res) {
            console.log("Word successfully added -> " + res.insertId);
            return res.insertId;
        }, function(err) {
            console.error(err);
            return -1;
        });
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

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.views.maxCache(0);
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
        templateUrl: 'templates/list-word.html',
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
        url: '/manage/videoQCM/edit/:id',
        templateUrl: 'templates/edit-video-qcm.html',
        controller: 'DataManagementController'
    })

    $stateProvider.state('list-video-qcm', {
        url: '/manage/videoQCM/list',
        templateUrl: 'templates/list-video-qcm.html',
        controller: 'DataManagementController'
    })

    $stateProvider.state('delete-video-qcm', {
        url: '/manage/videoQCM/delete',
        templateUrl: 'templates/delete-video-qcm.html',
        controller: 'DataManagementController'
    })

    $urlRouterProvider.otherwise('/home')

});
