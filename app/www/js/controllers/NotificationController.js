angular.module('cute.controllers')
    .controller('notificationController', function ($scope, $state, Constants, FacebookService, LocalStorageService, PushNotificationService) {

        $scope.$on('GcmNotification', function(event, data) {
            PushNotificationService.onGcmNotification(data);
        });

        $scope.$on(Constants.MessageHeartReceived, function(event, data) {
          var matchId = data.message;
          LocalStorageService.delete('heart' + matchId);
          FacebookService.getPersonInfo(matchId).then(function (personInfo) {
            $scope.personInfo = personInfo;
            $state.go('match');
          });
        });
    });