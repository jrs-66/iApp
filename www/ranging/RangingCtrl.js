angular.module('Ranging')

	.controller('RangingCtrl', ['$log', '$rootScope', '$scope', '$window', 'BeaconListFactory', 'LocalDataFactory', '$ionicNavBarDelegate', '$localForage', function ($log, $rootScope, $scope, $window, BeaconListFactory, LocalDataFactory, $ionicNavBarDelegate, $localForage) {

		$log.debug('Loaded RangingCtrl successfully.');

		$scope.forage = [];

		(function () {
			$log.debug('startRanging()');
			var reg = {
				uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
				identifier: 'jim2',
				typeName: 'BeaconRegion'
			};
			var beaconRegion = cordova.plugins.locationManager.Regions.fromJson(reg);
			$log.debug('Parsed BeaconRegion object:', JSON.stringify(beaconRegion, null, '\t'));

			$window.cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
				.fail($log.error)
				.done();
		})()

		var delegate = new cordova.plugins.locationManager.Delegate();

		delegate.didRangeBeaconsInRegion = function (pluginResult) {
			//$log.debug('didRangeBeaconsInRegion()', pluginResult);
			$log.debug('logged beacons in region');
			pluginResult.id = new Date().getTime();
			pluginResult.timestamp = new Date();

			$scope.$apply(function(){
				$scope.rangingEvents = pluginResult;
				BeaconListFactory.setList($scope.rangingEvents.beacons);
				var closestList = BeaconListFactory.getList();

				var closest = null;
				if (closestList.length) {
					$scope.name = closestList[0].name;
					$scope.closestForage = LocalDataFactory.getData($scope.name);
				} else {
					$scope.name = null;
					$scope.closestForage = null;
				}
			});



		};
		//
		// Init
		//
		$window.cordova.plugins.locationManager.requestAlwaysAuthorization();
		$window.cordova.plugins.locationManager.setDelegate(delegate);

		$scope.updateRangedRegions = function () {
			$window.cordova.plugins.locationManager.getRangedRegions().then(function (rangedRegions) {
				$log.debug('Ranged regions:', JSON.stringify(rangedRegions, null, '\t'));
				//$scope.rangedRegions = rangedRegions;
			});
		};
		$scope.updateRangedRegions();
	}]);
