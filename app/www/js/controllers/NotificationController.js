angular.module('cute.controllers')
    .controller('notificationController', function ($scope, $state, Constants, FacebookService,
      HeartCacheService, PushNotificationService) {

      $scope.$on('GcmNotification', forwardGcmNotificationToService);
      $scope.$on(Constants.MessageHeartReceived, handleReceivedHeartNotification);

      function forwardGcmNotificationToService(event, data) {
        PushNotificationService.onGcmNotification(data);
      }

      function handleReceivedHeartNotification(event, data) {
        var matchId = data.message;
        HeartCacheService.removeHeart(matchId);
        FacebookService.getPersonInfo(matchId).then(navigateToMatch);
      }

      function navigateToMatch(personInfo) {
        $scope.personInfo = personInfo;
        $state.go(Constants.NavigationStates.MATCH);
      }
    });