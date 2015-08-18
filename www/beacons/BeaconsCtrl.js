'use strict';

app.controller('BeaconsCtrl', ['$log', '$stateParams', '$scope', 'BeaconListFactory', function ($log, $stateParams, $scope, BeaconListFactory) {

  function fnd() {
    var obj = $scope.beacons.filter(function ( obj ) {
      return obj.minor === minor;
    })[0];
  }
	$log.debug('BeaconsCtrl is loaded.');


  $scope.beacons = BeaconListFactory.getList();

  $scope.$on('beaconListChange', function (val) {
    console.log("beacons refreshed");
    $scope.beacons = BeaconListFactory.getList();
    console.log($scope.beacons);
    //$scope.$apply();
  });
}]);

app.controller('BeaconCtrl', ['$log', '$stateParams', '$scope', 'BeaconListFactory', 'LocalDataFactory', 'Camera', '$localForage', '$cordovaFile', '$timeout', function ($log, $stateParams, $scope, BeaconListFactory, LocalDataFactory, Camera, $localForage, $cordovaFile, $timeout) {
  console.log("beacob cntroler");
  $scope.beaconName = function() {
    return $scope.beacon.major + '-' + $scope.beacon.minor;
  }

  $scope.beacon = BeaconListFactory.getList()[$stateParams.beacon];

  $scope.name = $scope.beaconName();
  $localForage.getItem($scope.name).then(
    function(value){
      $scope.test = value;
    },
    function(err) {
      console.log("didnt find key");
    }
  );

  function copyPhoto(fileEntry) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
      fileEntry.copyTo(fileSys.root, $scope.name + ".jpg", onCopySuccess, function() {
        console.log("error copying");
        fileSys.root.getFile($scope.name + ".jpg", {create: false, exclusive: false}, function(fileEntry) {
          fileEntry.remove(function() {
            console.log("FILE REMOVED");
            $localForage.removeItem($scope.name);
            window.resolveLocalFileSystemURL($scope.imageData, copyPhoto, fail);

          }, fail);
        }, fail);
      });
    }, function() {console.log("error copy photo");});
  }
  function onCopySuccess(entry) {
    LocalDataFactory.setData($scope.name, {url: entry.nativeURL});
  }
  function fail(error) {
      console.log(error);
  }

  function fnd() {
    var obj = $scope.beacons.filter(function ( obj ) {
      return obj.minor === minor;
    })[0];
  }
	$log.debug('BeaconCtrl is loaded.');



  $scope.getPhoto = function(source) {
    Camera.getPicture(source).then(
      function(imageData) {
        //createFileEntry(imageData);
        $scope.imageData = imageData;
        console.log("image");
        console.log(imageData);

        if ($scope.test) {
          $scope.test = false;
          $timeout(function(){
            $scope.test = { 'url': imageData  }
          }, 900);
        } else {
          $scope.test = { 'url': imageData  }
        }

        window.resolveLocalFileSystemURL(imageData, copyPhoto, fail);
      },
      function(err) {
        console.err(err);
      }
    );
  };
  $scope.deletePic = function() {
    $scope.test = false;
    $localForage.removeItem($scope.name);
  }

}]);
