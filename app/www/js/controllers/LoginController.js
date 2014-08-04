angular.module('cute.controllers')
  .controller('loginController', function ($scope, $state, Constants, CheckinService, FacebookService, LocalStorageService) {

    function saveCheckin(ownId) {
      var checkin = {
        facebook_id: ownId,
        time: Date.now()
      };

      CheckinService.save(checkin, function () {
        LocalStorageService.write(Constants.InitCompletedKey, true);
        $state.go('list');
      });
    }

    function login() {
      FacebookService.login().then(FacebookService.getOwnId).then(saveCheckin);
    }

    $scope.login = login;
  });
