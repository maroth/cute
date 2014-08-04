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
      HeartMatchDuration: millisecondsPerMinute * 10,
      FriendListRefreshInterval: millisecondsPerMinute * 3,
      HeartStateUpdateInterval: millisecondsPerSecond * 1,
      MatchScreenDuration: millisecondsPerSecond * 10, 
    };
  });