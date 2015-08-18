'use strict';



app.controller('PlayersCtrl', ['$log', '$http', '$scope', '$ionicPlatform', 'PlayerListFactory', function ($log, $http,  $scope, $ionicPlatform, PlayerListFactory) {

  $scope.$on('$ionicView.enter', function() {
    $scope.players = PlayerListFactory.getPlayers().then(function(data) {
      console.log(data);
      $scope.players = data;
    });
  });

  $scope.remove = function(player) {
    navigator.notification.confirm("Are you certain you wish to remove this player?", function(buttonIndex) {
      if (buttonIndex === 1) {
        $http.delete('http://dp23.com:9000/api/players/' + player._id).success(function(result){
          console.log("player deleted")
        });
        var idx = $scope.players.indexOf(player);
        $scope.players.splice(idx,1);
      }
    }, "Clear Local Storage", [ "Remove", "Cancel" ]);
  };

}]);

app.controller('PlayersActivateCtrl', ['$log', '$http', '$state', '$scope', '$ionicPlatform', function ($log, $http, $state, $scope, $ionicPlatform) {
  $scope.player = {
    name: "",
    code: "",
    merchant_id: 'my_id'
  }
  $scope.addPlayer = function(player) {
    $http.post('http://dp23.com:9000/api/players', player).success(function(player){
      $state.go( "tab.players" );
    });
  }
}]);

app.controller('PlayersDetailsCtrl', ['$log', '$http', 'PlayerListFactory', 'TemplateListFactory', '$stateParams', '$state', '$scope', function ($log, $http, PlayerListFactory, TemplateListFactory, $stateParams, $state, $scope) {

  $scope.player = PlayerListFactory.getPlayer($stateParams.player);
  TemplateListFactory.getTemplates().then(function(data){
    $scope.templates = data;
    console.log($scope.templates);
  });

  $scope.updatePlayer = function(player) {
    $http.put('http://dp23.com:9000/api/players/', player).then(function(){
      $state.go( "tab.players" );
    })
  }
}]);
