'use strict';

app.controller('EventLogCtrl', ['$log', '$scope', '$rootScope', 'BeaconListFactory', function ($log, $scope, $rootScope, BeaconListFactory) {

	$log.debug('EventLogCtrl is loaded.');

	$scope.doRefresh = function() {
		$scope.$apply(function() {
			$scope.beacons = BeaconListFactory.getList();
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.beacons = BeaconListFactory.getList();

}]);
