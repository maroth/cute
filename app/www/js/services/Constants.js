angular.module('cute.services')
  .factory('Constants', function() {
    var millisecondsPerMinute = 60000;
    var millisecondsPerSecond = 1000;
    return {
      AccessTokenKey: 'fbtoken',
      FriendCacheKey: 'friendCache',
      InitCompletedKey: 'initCompleted',
      HeartTimestampKey: 'heart',
      OwnFacebookIdKey: 'fbownin',

      FacebookPermissions: 'user_friends',
      MessageGcmReceived: 'GcmNotification',
      MessageHeartMatch: 'HeartMatch',

      HeartMatchDuration: millisecondsPerMinute * 10,
      FriendListRefreshInterval: millisecondsPerMinute * 3,
      HeartStateUpdateInterval: millisecondsPerSecond * 1,
      MatchScreenDuration: millisecondsPerSecond * 10, 

      HeartState: {
        NONE: 'none',
        ACTIVE: 'active',
        FAILED: 'failed',
        PENDING: 'pending'
      },

      NavigationStates: {
        INIT: 'init',
        LOGIN: 'login',
        LIST: 'list',
        MATCH: 'match'
      },

      TokenStates: {
        VALID: 'valid token',
        INVALID: 'no valid token',
        CONNECTION_ERROR: 'connection error'
      },

    };
  });