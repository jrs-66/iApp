app = angular.module('BeaconMonitor', [
	'ionic',
	'ionic.service.core',
	'com.unarin.cordova.proximity.quickstart.monitoring',
	'Ranging',
	'ngFx',
	'ngAnimate',
	'LocalForageModule',
	'ngCordova'
]).run(function ($ionicPlatform, $rootScope) {

	//$rootScope.auth = function() {
	//	console.log("authorize");
		//if (Authorize.auth()) $location.path( "#/tab/settings" );
	//}

	console.debug('Running BeaconMonitor');
	$ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
});

app.controller('MainCtrl', ['$log', '$rootScope', '$scope', '$location', function ($log, $rootScope, $scope, $location) {

	$scope.auth = function() {
		console.log("authorize");
		//if (Authorize.auth()) $location.path( "#/tab/settings" );
	}
	$log.debug('Loaded MainCtrl successfully.');

}]);


window.ionic.Platform.ready(function () {
	angular.bootstrap(document, ['BeaconMonitor']);
});
