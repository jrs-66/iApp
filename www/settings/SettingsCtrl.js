'use strict';

app.controller('SettingsCtrl', ['AuthServices', 'DebugModeFactory', '$log', '$scope', 'BeaconListFactory', 'LocalDataFactory', '$ionicPopup', '$ionicPlatform', '$location', function (AuthServices, DebugModeFactory, $log, $scope, BeaconListFactory, LocalDataFactory, $ionicPopup, $ionicPlatform, $location) {

	$log.debug('SettingsCtrl is loaded.');
  $scope.authorized = false;
  $scope.debug = DebugModeFactory.getMode();

  $scope.clearCache = function() {
    if ($scope.showConfirm()) {
      LocalDataFactory.clear();
    }
  }

  $scope.auth = function() {
    console.log('auth')
    $ionicPlatform.ready(function() {
      AuthServices.check().then(
        function(data) {
          console.log('AUTHORIZED');
          $scope.authorized = true;
        },
        function(err) {
          console.log('NOT AUTHORIZED');
          $scope.authorized = false;
        }
      );
    })
  }

  $scope.confirmDialog = function() {
    navigator.notification.confirm("Are you certain you wish to clear the entire cache?", function(buttonIndex) {
        switch(buttonIndex) {
            case 1:
                return true;
                break;
            case 2:
                return false;
                break;
        }
    }, "Clear Local Storage", [ "Clear", "Cancel" ]);
  }

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.auth();
  });

  $scope.debugMode = function() {
    $scope.debug = DebugModeFactory.toggleMode();
  }

}]);
