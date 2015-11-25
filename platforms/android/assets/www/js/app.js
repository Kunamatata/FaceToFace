// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('myApp', ['ionic']).run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

app.controller("HomeCtrl", function($scope, $ionicLoading, $http) {

    var list = [{
        name: 'Max',
        age: '22'
    }, {
        name: 'Romain',
        age: '22'
    }]

    $scope.search = function(request) {
        $scope.list = [];
        $http({
            method: 'jsonp',
            url: 'http://api.openweathermap.org/data/2.5/weather?q=' + request + ',uk&appid=2de143494c0b295cca9337e1e96b00e0&callback=JSON_CALLBACK'
        }).success(function(data) {
            console.log(data);
        })

        list.forEach(function(element, index) {
            if (request == element.name) {
                $scope.list.push(element);
            }
        });
        return $scope.list;
    };

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
