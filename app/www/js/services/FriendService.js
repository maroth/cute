angular.module('cute.services')
  .factory('FriendService', function ($q, $timeout, $filter, Constants, MobileServiceClientService, LocalStorageService) {

    var sort = function(friends) {
      var sortedFriends = $filter('orderBy')(friends, [
        function(friend) {
          var lastHeartTimestamp = LocalStorageService.read('heart' + friend.id);
          if (typeof lastHeartTimestamp == 'undefined') {
            lastHeartTimestamp = 0;
          } else {
            lastHeartTimestamp = lastHeartTimestamp * -1;
          }
          return lastHeartTimestamp;
        }, 'name'
      ], false);
      return sortedFriends;
    };

    var all = function() {
      var deferred = $q.defer();

      try {
        var cachedFriends = LocalStorageService.read(Constants.FriendCacheKey);
        cachedFriends = JSON.parse(cachedFriends);
        $timeout(function() {
          deferred.notify(cachedFriends);
        }, 0);
      } catch (e) {
      }

      MobileServiceClientService.getFriendsUsingCute().then(function(friends) {
        var sortedFriends = sort(friends);
        LocalStorageService.write(Constants.FriendCacheKey, JSON.stringify(sortedFriends));
        deferred.resolve(sortedFriends);
      });

      return deferred.promise;
    };

    return {
      all: all,
      sort: sort,
    };
  });