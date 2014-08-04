angular.module('cute.controllers')
  .controller('loginController', function($scope, $state, CheckinService, FacebookService) {
    $scope.login = function() {
      FacebookService.login().then(function() {
        FacebookService.getOwnId().then(function(ownId) {
          var checkin = { facebook_id: ownId, time: Date.now() };
          CheckinService.save(checkin);
          $state.go('list');
        });
      });
    };
  });
