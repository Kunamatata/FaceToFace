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
        db = $cordovaSQLite.openDB("face.db");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS word (id integer primary key, mot text)");
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

    $scope.search = function(mot) {
        var query = "SELECT mot FROM word WHERE mot = ?";
        $cordovaSQLite.execute(db, query, [mot]).then(function(res) {
            if (res.rows.length > 0) {
                console.log("SELECTED -> " + res.rows.item(0).mot);
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
            console.log("INSERT ID -> " + res.insertId);
        }, function(err) {
            console.error(err);
        });
    }

});

app.controller("LSFSearch", function($scope, $ionicLoading, $http) {

    $scope.images = [];

    /*Ici on chargera les images de la base de données pour affichée la grille des signes*/
    $scope.loadImages = function() {
        for (var i = 0; i < 16; i++) {
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
        // controller: 'HomeCtrl'
    })

    $stateProvider.state('en-search', {
        url: '/en-search',
        templateUrl: 'templates/en-search.html'
            // controller: 'HomeCtrl'
    })
    $urlRouterProvider.otherwise('/home')

});
