app.config( function($compileProvider ) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});


app.service('AuthServices', function($cordovaTouchID, $location, $q) {

  var authorized = false;
  var deferred = $q.defer();

  this.check = function() {

        if (authorized) {
          deferred.resolve(authorized);
          return deferred.promise;
        }

        return $cordovaTouchID.checkSupport().then(
          function(data) {
            return $cordovaTouchID.authenticate("Please authenticate to access settings.").then(
              function() {
                authorized = true;
                deferred.resolve(authorized);
                return deferred.promise;
              },
              function(error) {
                deferred.reject(authorized);
                console.log(JSON.stringify(error));
                $location.path( "#/tab/ranging" );
                return deferred.promise;
              }
            );
          },
          function(error) {
            authorized = true;
            deferred.resolve(authorized);
            return deferred.promise;
          }
        );
      };


});

app.factory('DebugModeFactory', function() {
  var debug = false;

  return {
    toggleMode: function() {
      debug = !debug;
      return debug;
    },
    getMode: function() {
      console.log("DUBUG - " + debug);
      return debug;
    }
  }
});

app.factory('TemplateListFactory', function($http, $q) {
  var list = [];
  var listRetrieved = false;

  function getList () {
    var deferred = $q.defer();

    if (listRetrieved) {
      deferred.resolve(list);
    }
    $http.get('http://dp23.com:9000/api/templates').success(function(data) {
      list = data;
      listRetrieved = true;
      deferred.resolve(list);
    });
    return deferred.promise;
  };

  function getTemplate(id) {
    for (var i=0; i < list.length; i++) {
      if (list[i]._id === id) {
        return list[i];
      }
    }
  }

  return {
    getTemplates: getList,
    getTemplate: getTemplate
  }
});

app.factory('PlayerListFactory', function($http, $q) {
  var list = [];
  var listRetrieved = false;

  function getList () {
    var deferred = $q.defer();

    if (listRetrieved) {
      deferred.resolve(list);
    }
    $http.get('http://dp23.com:9000/api/players').success(function(data) {
      list = data;
      listRetrieved = true;
      deferred.resolve(list);
    });
    return deferred.promise;
  };

  function getPlayer(id) {
    for (var i=0; i < list.length; i++) {
      if (list[i]._id === id) {
        return list[i];
      }
    }
  }

  return {
    getPlayers: getList,
    getPlayer: getPlayer
  }
});
app.factory('BeaconListFactory', function($rootScope, DebugModeFactory){
    var list = [];

    function debugList(tList) {
      if (DebugModeFactory.getMode()) {
        console.log('DEBUG MODE LIST');
        tList.push(
          {
            major: 1,
            minor: 111,
            name: "1-5",
            rssi: -77,
            uuid: "B9407F30-F5F8-466E-AFF9-25556B57FE6D"
          }
        );
      }
    }
    debugList(list);

    return {
      beacons: list,
      getBeacon: function(index) {
        return list[index]
      },
      setList: function(newList) {
        for (var i=0; i<newList.length; i++) {
          if (newList[i].rssi == 0) {
            newList.splice(i, 1);
          }
        }

        debugList(newList);

        if (list.length != newList.length) {
          list = newList;
          $rootScope.$broadcast('beaconListChange', true);
        } else {
          list = newList;
        }

        return;
      },
      getList: function() {

        if (list.length === 0) return false;

        list.sort(function(a, b){
          if (a.rssi < b.rssi) {
            return 1;
          }
          if (a.rssi > b.rssi) {
            return -1;
          }
          return 0;
        });
        list[0].name = list[0].major + "-" + list[0].minor;
        return list;
      }
    }
});

app.factory('LocalDataFactory', ['$localForage', function($localForage){
    var list = [];

    return {
      getData: function(key) {
        if (typeof list[key] === 'undefined') {
          list[key] = {found: true};
          $localForage.getItem(key).then(
            function(data) {
              console.log("forage success");
              console.log(data);
              console.log(key);
              for (var k in data) list[key][k] = data[k];
            },
            function(err) {
              console.log("forage err");
              console.log(err);
            }
          )
        }
        return list[key]
      },
      setData: function(key, data) {
        if (typeof list[key] === 'undefined') list[key] = {found: true};

        for (var k in data) {
          if (k === 'url') {
            data[k] = data[k] + '?' + new Date().getTime();
          }
          list[key][k] = data[k];
        }
        $localForage.setItem(key, list[key]);
        return list[key];
      },
      clear: function() {
        $localForage.clear().then(function(){
          list = [];
        });
      }
    }
}]);

app.directive('jsChange', function($animate, $timeout) {
  return function(scope, elem, attr) {
    scope.$watch(attr.jsChange, function(nv, ov) {
      if (nv != ov) {
        //var c = nv > ov ? 'change-up' : 'change';
        var c = "bounceIn";
        //$animate.animate(elem, c).then (
        $animate.addClass(elem, c).then(
          function() {
            $timeout( function() {
              $animate.removeClass(elem, c);
            }, 2000);
          }
        );
      };
    });
  };
});

app.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(source) {
      var q = $q.defer();
      var source;
      if (source == "LIBRARY") source = Camera.PictureSourceType.PHOTOLIBRARY;
      else source = Camera.PictureSourceType.CAMERA;

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      },
      {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: source
      }
      );

      return q.promise;
    }
  }
}])
