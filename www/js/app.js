// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory('AuthService', function($rootScope) {
	var loggedIn = false;
	return {
		checkLogin : function() {
		//$rootScope.$broadcast('loggedIn', { 'loggedIn' : loggedIn });
		return loggedIn;
    	},
		login : function() {
	    	loggedIn = true;
			userid = 1;
			username = "shaf2k";
	    	$rootScope.$broadcast('loggedIn', {
				'loggedIn': loggedIn,
				'userid': 1,
				'username': username
			});
		},
		logout : function() {
			loggedIn = false;
			//$rootScope.$broadcast('loggedOut', { 'loggedIn' : loggedIn });
		}
  	}
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('login', {
	 	url: "/login",
		controller: 'loginController',
		templateUrl: 'templates/login.html'
  	})
	.state('main', {
  		url: "/main",
    	controller: 'mainController',
		templateUrl: 'templates/main.html'
    });
	
	$urlRouterProvider.otherwise('/login');
});