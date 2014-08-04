angular.module('cute.controllers')
    .controller('mainController', function($scope, $state, Constants, PushNotificationService) {

        $scope.$on('GcmNotification', function(event, data) {
            PushNotificationService.onGcmNotification(data);
        });

        $scope.$on(Constants.MessageHeartReceived, function(event, data) {
            var matchingId = data.message;
            $state.go('match', { matchId: matchingId });
        });
    });