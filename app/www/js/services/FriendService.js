angular.module('cute.services')
  .factory('FriendService', function ($q, $timeout, $filter, Constants, HeartCacheService, MobileServiceClientService, LocalStorageService) {
    return {
      all: all,
      sort: sort,
    };

    function sort(friends) {
      var sortedFriends = $filter('orderBy')(friends, [compareByDurationSinceLastHeart, 'name'], false);
      return sortedFriends;

      function compareByDurationSinceLastHeart(friend) {
        var lastHeartTimestamp = HeartCacheService.durationSinceLastHeart(friend.id);
        return lastHeartTimestamp;
      }
    }

    function all() {
      var deferred = $q.defer();

      try {
        loadFriendsFromCache();
      } catch (e) {
      }

      MobileServiceClientService.getFriendsUsingCute().then(writeToCacheAndResolve);

      return deferred.promise;

      function loadFriendsFromCache() {
        var serializedFriends = LocalStorageService.read(Constants.FriendCacheKey);
        var cachedFriends = JSON.parse(serializedFriends);
        var sortedFriends = sort(cachedFriends);

        $timeout(notifyPromiseWithCachedFriends, 0);

        function notifyPromiseWithCachedFriends() {
          deferred.notify(sortedFriends);
        }
      }

      function writeToCacheAndResolve(friends) {
        var sortedFriends = sort(friends);
        LocalStorageService.write(Constants.FriendCacheKey, JSON.stringify(sortedFriends));
        deferred.resolve(sortedFriends);
      }
    }
  });