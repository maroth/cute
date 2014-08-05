angular.module('cute.controllers')
  .controller('listController', function ($state, $scope, $rootScope, $interval, $filter, Constants, FriendService,
    HeartService, HeartCacheService, FacebookService, LocalStorageService, PushNotificationService) {

    PushNotificationService.register();
    updateFriendList();

    var heartStateUpdater = $interval(updateHeartStates, Constants.HeartStateUpdateInterval);
    var friendListUpdater = $interval(updateFriendList, Constants.FriendListRefreshInterval);
    $scope.$on('$destroy', stopPeriodicallyRunningUpdaters);

    $scope.createHeart = createHeart;

    function stopPeriodicallyRunningUpdaters() {
      $interval.cancel(heartStateUpdater);
      $interval.cancel(friendListUpdater);
    }

    function updateFriendList() {
      FriendService.all().then(setFriendsOnScope, function() {}, setFriendsOnScope);
    }

    function setFriendsOnScope(friends) {
      $scope.friends = friends;
      updateHeartStates();
    }

    function updateHeartStates() {
      if ($scope.friends) {
        $scope.friends.forEach(function (friend) {
          var durationSinceLastHeart = HeartCacheService.durationSinceLastHeart(friend.id);
          if (friend.heartState == Constants.HeartState.ACTIVE && durationSinceLastHeart > Constants.HeartMatchDuration) {
            friend.heartState = Constants.HeartState.NONE;
          }
          if (friend.heartState == Constants.HeartState.NONE && durationSinceLastHeart < Constants.HeartMatchDuration) {
            friend.heartState = Constants.HeartState.ACTIVE;
          }
        });
      }
    }

    function getFriendInListById(friendId) {
      for (var i = 0; i < $scope.friends.length; i++) {
        if ($scope.friends[i].id == friendId) {
          return $scope.friends[i];
        }
      }
    }

    function createHeart(friendId) {

      var friendInList = getFriendInListById(friendId);

      if (friendInList.heartState == Constants.HeartState.ACTIVE || friendInList.heartState == Constants.HeartState.PENDING) {
        return;
      }

      friendInList.heartState = Constants.HeartState.PENDING;

      FacebookService.getOwnId().then(saveHeartToService);

      function saveHeartToService(myId) {
        var heart = {
          from: myId,
          to: friendId,
          time: Date.now()
        };

        HeartService.save(heart, handleSuccess, handleFailure);

        function handleSuccess() {
          HeartCacheService.cacheHeart(friendId);
          friendInList.heartState = Constants.HeartState.ACTIVE;
          $scope.friends = FriendService.sort($scope.friends);
        }

        function handleFailure() {
          friendInList.heartState = Constants.HeartState.FAILED;
        }
      }
    }
  });