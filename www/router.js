'use strict';

app.config(function ($stateProvider, $urlRouterProvider) {

	window.console.debug('Configuring BeaconMmonitor');
	console.log($stateProvider);
	$stateProvider
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

	.state('tab.ranging', {
		url: '/ranging',
		views: {
			'tab-ranging': {
				templateUrl: 'ranging/tab-ranging.html',
				controller: 'RangingCtrl'
			}
		}
	})

	.state('tab.settings', {
		url: '/settings',
		views: {
			'tab-settings': {
				templateUrl: 'settings/settings.html',
				controller: 'SettingsCtrl'
			}
		}
	})

  .state('tab.settingsdebug', {
		url: '/settings/debug',
		views: {
			'tab-settings': {
				templateUrl: 'settings/debug.html',
				controller: 'SettingsCtrl'
			}
		}
	})

	.state('tab.beaconsdetail', {
		url: '/beacons/:beacon',
		views: {
			'tab-settings': {
				templateUrl: 'beacons/details.html',
				controller: 'BeaconCtrl'
			}
		}
	})

	.state('tab.beacons', {
		url: '/beacons',
		views: {
			'tab-settings': {
				templateUrl: 'beacons/beacons.html',
				controller: 'BeaconsCtrl'
			}
		}
	})

  .state('tab.players', {
		url: '/players',
		views: {
			'tab-settings': {
				templateUrl: 'players/list.html',
				controller: 'PlayersCtrl'
			}
		}
	})

  .state('tab.playerdetails', {
		url: '/players/:player',
		views: {
			'tab-settings': {
				templateUrl: 'players/details.html',
				controller: 'PlayersDetailsCtrl'
			}
		}
	})

  .state('tab.playeractivate', {
		url: '/players/activate',
		views: {
			'tab-settings': {
				templateUrl: 'players/activate.html',
				controller: 'PlayersActivateCtrl'
			}
		}
	})

	.state('tab.eventlog', {
		url: '/eventlog',
		views: {
			'tab-settings': {
				templateUrl: 'eventlog/EventLog.html',
				controller: 'EventLogCtrl'
			}
		}
	})

	$urlRouterProvider.otherwise('/tab/ranging');
});
