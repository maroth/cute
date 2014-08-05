angular.module('cute.controllers')
  .controller('loginController', function ($scope, $state, Constants, CheckinService, FacebookService, LocalStorageService) {

    $scope.login = login;

    function login() {
      FacebookService.login().then(FacebookService.getOwnId).then(saveCheckin);
    }

    function saveCheckin(ownId) {
      var checkin = {
        facebook_id: ownId,
        time: Date.now()
      };

      CheckinService.save(checkin, handleSuccess);

      function handleSuccess() {
        LocalStorageService.write(Constants.InitCompletedKey, true);
        $state.go(Constants.NavigationStates.LIST);
      }
    }
  });
