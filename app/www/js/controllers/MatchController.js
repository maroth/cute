angular.module('cute.controllers')
  .controller('matchController', function ($state, $timeout, Constants) {

    $timeout(navigateToList, Constants.MatchScreenDuration);

    if (navigator.notification) {
      navigator.notification.vibrate(Constants.MatchScreenDuration);
    }

    function navigateToList() {
      $state.go(Constants.NavigationStates.LIST);
    }
  });
