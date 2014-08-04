angular.module('cute.controllers')
    .controller('initController', function ($state, Constants, LocalStorageService) {
      document.addEventListener('deviceready', function () {
        var initializationCompleted = LocalStorageService.read(Constants.InitCompletedKey);
        if (initializationCompleted) {
          $state.go('list');
        } else {
          $state.go('login');
        }
      }, false);
    });