angular.module('cute.controllers')
    .controller('initController', function ($state, Constants, LocalStorageService) {

      document.addEventListener('deviceready', navigate);

      function navigate() {
        var isInitializationCompleted = LocalStorageService.read(Constants.InitCompletedKey);
        if (isInitializationCompleted) {
          $state.go(Constants.NavigationStates.LIST);
        } else {
          $state.go(Constants.NavigationStates.LOGIN);
        }
      }
    });