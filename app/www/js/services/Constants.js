angular.module('cute.services')
  .factory('Constants', function() {
    var millisecondsPerMinute = 60000;
    var millisecondsPerSecond = 1000;
    return {
      AccessTokenKey: 'fbtoken',
      FriendCacheKey: 'friendCache',
      FacebookPermissions: 'user_friends',
      MessageGcmReceived: 'GcmNotification',
      MessageHeartMatch: 'HeartMatch',
      HeartMatchDuration: millisecondsPerMinute * 0.05, //10 minutes
      FriendListRefreshInterval: millisecondsPerMinute * 3,
      HeartStateUpdateInterval: millisecondsPerSecond * 1,
      MatchScreenDuration: millisecondsPerSecond * 60, //10 seconds
    };
  });