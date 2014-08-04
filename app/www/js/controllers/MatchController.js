angular.module('cute.controllers')
  .controller('matchController', function ($scope, $state, $stateParams, $timeout, Constants) {
    navigator.notification.vibrate(10000);
    $timeout(function () { $state.go('init'); }, Constants.MatchScreenDuration);
  });
