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

/* A RETIRER *//* A RETIRER *//* A RETIRER *//* A RETIRER *//* A RETIRER *//* A RETIRER *//* A RETIRER *//* A RETIRER */
//$cordovaSQLite.execute(db, "DROP table word");
//$cordovaSQLite.execute(db, "DROP table sign");
//$cordovaSQLite.execute(db, "DROP table video");
//$cordovaSQLite.execute(db, "DROP table wording");
//$cordovaSQLite.execute(db, "DROP table configuration");
//$cordovaSQLite.execute(db, "DROP table dialog");
//$cordovaSQLite.execute(db, "DROP table genealogy");
/*___________________*/

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS word(id INTEGER PRIMARY KEY, frenchWord TEXT, englishWord TEXT, idSignLSF INTEGER, idSignASL INTEGER,FOREIGN KEY(idSignLSF) REFERENCES sign(id), FOREIGN KEY(idSignASL) REFERENCES sign(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS sign(id INTEGER PRIMARY KEY, language INTEGER, idVideo INTEGER, FOREIGN KEY(idVideo) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS configuration(id INTEGER PRIMARY KEY, language INTEGER, imageURL TEXT)");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS position(id INTEGER PRIMARY KEY, positionName TEXT)");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS wording(id INTEGER PRIMARY KEY, wordID INTEGER, videoIDLSF INTEGER, videoIDASL INTEGER, FOREIGN KEY(wordID) REFERENCES word(id), FOREIGN KEY(videoIDLSF) REFERENCES video(id), FOREIGN KEY(videoIDASL) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS video(id INTEGER PRIMARY KEY, youtubeURL TEXT, localURL TEXT)");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS subtitle(id INTEGER PRIMARY KEY, timer DATE)");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS sentenceQCM(id INTEGER PRIMARY KEY, difficultyLevel INTEGER, sentence TEXT, videoIDALSF INTEGER,videoIDAASL INTEGER, videoIDBLSF INTEGER, videoIDBASL INTEGER, videoIDCLSF INTEGER, videoIDCASL INTEGER, videoIDDLSF INTEGER, videoIDDASL INTEGER,goodAnswer TEXT, FOREIGN KEY(videoIDALSF) REFERENCES video(id), FOREIGN KEY(videoIDAASL) REFERENCES video(id), FOREIGN KEY(videoIDBLSF) REFERENCES video(id), FOREIGN KEY(videoIDBASL) REFERENCES video(id), FOREIGN KEY(videoIDCLSF) REFERENCES video(id), FOREIGN KEY(videoIDCASL) REFERENCES video(id), FOREIGN KEY(videoIDDLSF) REFERENCES video(id), FOREIGN KEY(videoIDDASL) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS videoQCM(id INTEGER PRIMARY KEY, difficultyLevel INTEGER, videoIDLSF INTEGER, videoIDASL INTEGER,sentenceA TEXT, sentenceB TEXT, sentenceC TEXT, sentenceD TEXT, goodAnswer TEXT, FOREIGN KEY(videoIDLSF) REFERENCES video(id), FOREIGN KEY(videoIDASL) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS genealogy(id INTEGER PRIMARY KEY, wordID INTEGER, frenchDescription TEXT, englishDescrption TEXT, videoIDLSFDescription INTEGER, videoIDASLDescription INTEGER, FOREIGN KEY (wordID) REFERENCES word(id),FOREIGN KEY (videoIDLSFDescription) REFERENCES video(id), FOREIGN KEY (videoIDASLDescription) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS dialog(id INTEGER PRIMARY KEY, wordID INTEGER, language INTEGER, videoID INTEGER, FOREIGN KEY(wordID) REFERENCES word(id), FOREIGN KEY(videoID) REFERENCES video(id))");

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS positionConfigurationSign(signID INTEGER PRIMARY KEY, configurationID INTEGER PRIMARY KEY, positionID INTEGER PRIMARY KEY, FOREIGN KEY(signID) REFERENCES sign(id), FOREIGN KEY(configurationID) REFERENCES configuration(id), order INTEGER, FOREIGN KEY(positionID) REFERENCES position(id))");
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
        var query = "INSERT INTO sign (language, idVideo) VALUES(0, ?),(1, ?)";
        $cordovaSQLite.execute(db, query, [idFrenchVideo, idEnglishVideo]).then(function(res) {
            console.log("Signs successfully added -> " + res.insertId);
            return callback(frenchWord, englishWord, res.insertId - 1, res.insertId);
        }, function(err) {
            console.error(err);
            return -1;
        });
    };

    $scope.insertWord = function(frenchWord, englishWord, idFrenchSign, idEnglishSign) {
        var query = "INSERT INTO word (frenchWord, englishWord, idSignLSF, idSignASL) values(?, ?, ?, ?)";
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
            return callback(idWord, res.insertId -3, res.insertId -2,res.insertId -1, res.insertId);
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
        var query = "INSERT INTO sign (language, idVideo) values(?, ?)";
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

    //$scope.insertNewWord("Racine", "Root", "https://www.youtube.com/embed/XQEFR5YmIP4", "https://www.youtube.com/embed/9IMWwkhv610");
    //$scope.insertNewWord("Rang", "Rank", "https://www.youtube.com/embed/-TBhtvoJFmM", "https://www.youtube.com/embed/1D0WPo2wTSA");

    //$scope.insertNewWording(1, "https://www.youtube.com/embed/60pdCwdN-kg", "https://www.youtube.com/embed/yhy19VUoKAY", "https://www.youtube.com/embed/YVP6M2u2sf0", "https://www.youtube.com/embed/9mp2E58UlR4");

    //$scope.insertNewDialog(1, 1, "https://www.youtube.com/embed/yhy19VUoKAY");

    /*for(i = 0; i < 46; i++)
    {
        $scope.insertConfiguration(0, "../config_" + (i+1) + ".jpg");
    }*/

    /*$scope.searchFrenchWord("Romain");
    setTimeout(function(){
        console.log($scope.word.frenchWord);
        //$scope.deleteWord("Romain");
    }, 2000);*/
});

// Factory service to share word between controllers
app.factory('SharingWordInformation', function()
{
    var word = {};
    var wordingChoice = 0;
    var dialogChoice = 0;
    var dialogLanguageChoice = 0;

        return {
        getWord: function () {
            return word;
        },
        setWord: function (newWord) {
            // If the word we want to search is not set or if it is not the last one we searched
            if(word.id == undefined || (word.id != undefined && word.id != newWord.id))
            {
                word = newWord;
            }
        },
        getWordingChoice : function()
        {
            return wordingChoice;
        },
        setWordingChoice : function(number)
        {
            wordingChoice = number;
        },
        getDialogChoice : function()
        {
            return dialogChoice;
        },
        setDialogChoice : function(number)
        {
            dialogChoice = number;
        },
        getDialogLanguageChoice : function()
        {
            return dialogLanguageChoice;
        },
        setDialogLanguageChoice : function(number)
        {
            dialogLanguageChoice = number;
        }
    };
});

// Factory service to share qcm information between controllers
app.factory('SharingQCMInformation', function()
{
    var difficultyLevel = 0;

        return {
        getDifficultyLevel: function () {
            return difficultyLevel;
        },
        setDifficultyLevel: function (level) {
            difficultyLevel = level;
        }
    };
});

app.controller("LSFSearch", function($scope, $ionicLoading, $http, $ionicScrollDelegate) {

    $scope.images = [];
    $scope.selectedHand = "";


    // Scroll to the top of the page
    scrollTop = function() {
        $ionicScrollDelegate.scrollTop(true);
    };

    // Loading french sign configurations in scope.images
    $scope.loadImages = function() {
        if($scope.images.length == 0)
        {
            for (var i = 1; i < 47; i++) {
                $scope.images.push({
                    src: "../img/sign_config/config_" + i.toString() + ".jpg"
                });
            };
        }
    };

    $scope.activateSelection = function(handDivisionID)
    {
        $scope.selectedHand = handDivisionID;

        document.getElementById("configuration-grid").style.visibility = 'visible';
    };

    $scope.configurationSelected = function(image, index)
    {
        if($scope.selectedHand != "")
        {
            document.getElementById($scope.selectedHand).style="background-image: url(" + image.src + ");";

            $scope.selectedHand = "";

            document.getElementById("configuration-grid").style.visibility = 'hidden';

            scrollTop();
        }
    };

    $scope.deleteChosenConfiguration = function(handDivisionID)
    {
        document.getElementById(handDivisionID).style="background-image: url('../img/hand.png');";
    };

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

    // Search potential words which start like the
    $scope.searchPotentialWords = function(searchedWord, language) {
        $scope.words = [];

        if(searchedWord != "")
        {
            var query = "SELECT id, englishWord, frenchWord FROM word WHERE " + (language==0?"frenchWord":"englishWord") + " LIKE ?";
            $cordovaSQLite.execute(db, query, [searchedWord + "%"]).then(function(res) {
                if (res.rows.length > 0) {
                    console.log("SearchPotentialWords : SELECTED -> " + res.rows.length);

                    var numberWords = (res.rows.length > 5 ? 5 : res.rows.length);

                    for (var i = 0; i < numberWords; i++) {
                        $scope.words.push(res.rows.item(i));
                    };
                }
                else {
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

app.controller("WordPresentation", function($scope, $sce, $ionicLoading, $http, $cordovaSQLite, SharingWordInformation) {

    $scope.prepareWordInformation = function() {
        $scope.word = SharingWordInformation.getWord();

        // If we don't have the word information in memory, we execute a search query
        if($scope.word.frenchVideo == undefined || $scope.word.englishVideo == undefined)
        {
            var query = "SELECT idSignLSF, idSignASL FROM word WHERE id = ?";
                $cordovaSQLite.execute(db, query, [$scope.word.id]).then(function(res) {
                    if (res.rows.length > 0) {
                        console.log("prepareWordInformations : SELECTED -> " + res.rows.item(0));

                        $scope.searchYoutubeURLBySignIDs(res.rows.item(0).idSignLSF, res.rows.item(0).idSignASL);

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

        var query = "SELECT language, youtubeURL, localURL FROM sign, video WHERE (sign.id = ? OR sign.id = ?) AND sign.idVideo = video.id";
            $cordovaSQLite.execute(db, query, [idSignLSF, idSignASL]).then(function(res) {
                if (res.rows.length == 2) {
                    console.log("searchYoutubeURLBySignIDs : SELECTED -> " + res.rows.length);

                    if(res.rows.item(0).language = 0)
                    {
                          $scope.word.englishVideo = res.rows.item(0);
                          $scope.word.frenchVideo = res.rows.item(1);
                    }
                    else
                    {
                        $scope.word.englishVideo = res.rows.item(1);
                        $scope.word.frenchVideo = res.rows.item(0);
                    }

                } else {
                    console.log("No results found");
                }
            }, function(err) {
                console.error(err);
            }
        );
    };

    // Trust the URL so Angular can load the corresponding template
    $scope.trustUrl = function(url) {
        return $sce.trustAsResourceUrl(url);
    }

    $scope.setWordingChoice = function(number){
        SharingWordInformation.setWordingChoice(number);
    }
});

app.controller("WordingPresentation", function($scope, $sce, $ionicLoading, $http, $cordovaSQLite, SharingWordInformation) {

    $scope.prepareWordingInformation = function() {
        $scope.word = SharingWordInformation.getWord();
        $scope.wordingChoice = SharingWordInformation.getWordingChoice();

        // If we don't have the word's wordings information in memory, we execute a search query
        if($scope.wordings == undefined)
        {
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

                    for(var i = 0; i < 4; i++)
                    {
                        console.log(res.rows.item(i))
                        switch(res.rows.item(i).id)
                        {
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
            }
        );
    };

    // Enable to trust the URL so Angular can load the corresponding template
    $scope.trustUrl = function(url) {
        return $sce.trustAsResourceUrl(url);
    }

    $scope.setWord = function() {
        SharingWordInformation.setWord($scope.word);
    };

    $scope.setWordingChoice = function(number){
        SharingWordInformation.setWordingChoice(number);
    }

    $scope.prepareWordingInformation();
});

app.controller("DialogList", function($scope, $sce, $ionicLoading, $http, $cordovaSQLite, SharingWordInformation) {

        $scope.searchDialogs = function() {
            $scope.word = SharingWordInformation.getWord();

            // If we don't have the word's wordings information in memory, we execute a search query
            if($scope.word.frenchDialogList == undefined && $scope.word.englishDialogList == undefined)
            {
                var query = "SELECT * FROM dialog WHERE wordID = ?";
                    $cordovaSQLite.execute(db, query, [$scope.word.id]).then(function(res) {
                        if (res.rows.length > 0) {
                            console.log("searchDialogs : SELECTED -> " + res.rows.length);

                            $scope.word.frenchDialogList = [];
                            $scope.word.englishDialogList = [];

                            for(i = 0; i < res.rows.length; i++)
                            {
                                if(res.rows.item(i).language == 0)
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

    $scope.setDialogChoice = function(number, language){
        SharingWordInformation.setDialogChoice(number);
        SharingWordInformation.setDialogLanguageChoice(language);
    };

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
        if($scope.dialogLanguageChoice == 0)
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
});

app.controller("QCMController", function($scope, $sce, $ionicLoading, $http, $cordovaSQLite, SharingQCMInformation) {

    var videoQCMList = [];

    $scope.updateVideoQCM = function () {
        // Select a random question in the list of questions
        // search the corresponding videos, and update view
    };

    $scope.loadSentencesQuestion = function () {
        difficultyLevel = SharingQCMInformation.getDifficultyLevel();

        var query = "SELECT * from videoQCM where difficultyLevel = ?";
        $cordovaSQLite.execute(db, query, [difficultyLevel]).then(function(res) {
            if (res.rows.length > 0) {
                console.log("loadSentencesQuestion : SELECTED -> " + res.rows.length);

                // Store each sentences
                for (var i = 0; i < res.rows.length; i++) {
                videoQCMList.push(res.rows.item(i));
                };

            } else {
                console.log("No results found");
            }
        }, function(err) {
            console.error(err);
        });
    };

    $scope.setDifficultyLevel = function (level) {
        SharingQCMInformation.setDifficultyLevel(level);
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
        controller: 'WordSearch'
    })

    $stateProvider.state('asl-search', {
        url: '/asl-search',
        templateUrl: 'templates/asl-search.html',
        controller: 'ASLSearch'
    })

    $stateProvider.state('en-search', {
        url: '/en-search',
        templateUrl: 'templates/en-search.html',
        controller: 'WordSearch'
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

    $urlRouterProvider.otherwise('/home')

});
