angular.module('cute.controllers')
  .controller('listController', function($scope, $interval, $filter, Constants, FriendService, HeartService, FacebookService, LocalStorageService, PushNotificationService) {

    PushNotificationService.register();

    var updateFriendList = function() {
      FriendService.all().then(function(friends) {
        $scope.friends = friends;
        updateHeartState();
      }, function (failed) { }, function (update) {
        $scope.friends = update;
        updateHeartState();
      });
    }

    var updateHeartState = function() {
      if ($scope.friends) {
        $scope.friends.forEach(function(friend) {
          var lastHearted = LocalStorageService.read('heart' + friend.id);
          if (friend.heartState == 'active' && Date.now() - lastHearted > Constants.HeartMatchDuration) {
            friend.heartState = 'none';
          }
          if (friend.heartState == 'none' && Date.now() - lastHearted < Constants.HeartMatchDuration) {
            friend.heartState = 'active';
          }
        });
      }
    }

    updateFriendList();

    var heartStateUpdater = $interval(updateHeartState, Constants.HeartStateUpdateInterval);
    var friendListUpdater = $interval(updateFriendList, Constants.FriendListRefreshInterval);

    $scope.$on('$locationChangeStart', function(scope, next, current) {
      if (next.indexOf('list') == -1) {
        $interval.cancel(heartStateUpdater);
        $interval.cancel(friendListUpdater);
      }
    });

    $scope.createHeart = function(targetFacebookId) {
      var friendInList;
      for (var i = 0; i < $scope.friends.length; i++) {
        if ($scope.friends[i].id == targetFacebookId) {
          friendInList = $scope.friends[i];
          break;
        }
      }

      if (friendInList.heartState == 'active' || friendInList.heartState == 'pending') {
        return;
      }

      friendInList.heartState = 'pending';

      FacebookService.getOwnId().then(function (myFacebookId) {
        var heart = {
          from: myFacebookId,
          to: targetFacebookId,
          time: Date.now()
        };

        HeartService.save(heart, function() {
          LocalStorageService.write('heart' + targetFacebookId, heart.time)
          friendInList.heartState = 'active';
          $scope.friends = FriendService.sort($scope.friends);
        }, function(e) {
          friendInList.heartState = 'failed';
        });
      });
    };
  });