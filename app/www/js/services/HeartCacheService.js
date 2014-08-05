angular.module('cute.services')
  .factory('HeartCacheService', function (Constants, LocalStorageService) {

    return {
      cacheHeart: cacheHeart,
      removeHeart: removeHeart,
      durationSinceLastHeart: durationSincelastHeart,
    }

    function cacheHeart(friendId) {
      var localStorageKey = createKey(friendId);
      LocalStorageService.write(localStorageKey, Date.now());
    }

    function removeHeart(friendId) {
      var localStorageKey = createKey(friendId);
      LocalStorageService.delete(localStorageKey);
    }

    function durationSincelastHeart(friendId) {
      var localStorageKey = createKey(friendId);
      var lastHeartTimestamp = LocalStorageService.read(localStorageKey);
      if (typeof (lastHeartTimestamp) === typeof (undefined)) {
        lastHeartTimestamp = 0;
      }
      var duration = Date.now() - lastHeartTimestamp;
      return duration;
    }

    function createKey(friendId) {
      return Constants.HeartTimestampKey + friendId;
    }
  });