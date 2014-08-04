angular.module('cute.controllers')
  .controller('matchController', function($scope, $state, $stateParams, $timeout, Constants, PushNotificationService, FacebookService, LocalStorageService) {
    LocalStorageService.delete('heart' + $stateParams.matchId);
    FacebookService.getPersonInfo($stateParams.matchId).then(function(personInfo) {
      navigator.notification.vibrate(10000);
      $scope.name = personInfo.name;
      $scope.picture = personInfo.picture.data.url;
      $timeout(function () { $state.go('init'); }, Constants.MatchScreenDuration);
    });
  });
