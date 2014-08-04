angular.module('cute.services')
.factory('FacebookService', function ($resource, $q, Constants, Secrets, LocalStorageService) {
  var tokenStore = {};
  tokenStore[Constants.AccessTokenKey] = LocalStorageService.read(Constants.AccessTokenKey);
  openFB.init(Secrets.FacebookAppId, undefined, tokenStore);

  var accessToken = function() {
    return tokenStore[Constants.AccessTokenKey];
  };

  var getTokenState =  function() {
    var deferred = $q.defer();

    var token = accessToken();
    if (typeof(token) == 'undefined') {
      deferred.resolve('no valid token');
    } else {
      getArbitraryDataFromFacebookToTestToken(
        function() { 
          deferred.resolve('valid token'); 
        }, function(e) {
          if (e.type == 'OAuthException') {
            deferred.resolve('no valid token'); 
          }
          deferred.resolve('connection error'); 
        }
      );
    }

    return deferred.promise;
  };

  var getArbitraryDataFromFacebookToTestToken = function(success, error) {
    openFB.api({
      path: '/me',
      params: { fields: 'id', limit: 1, offset: 0 },
      success: success,	
      error: error,
    });
  };

  var login = function() {
    var deferred = $q.defer();

    openFB.login(Constants.FacebookPermissions, function() { 
      var token = tokenStore[Constants.AccessTokenKey];
      LocalStorageService.write(Constants.AccessTokenKey, token);
      deferred.resolve();
    });

    return deferred.promise;
  };

  var validatedAccessToken = function() {
    var deferred = $q.defer();

    getTokenState().then(function(tokenState) {
      if (tokenState == 'valid token') {
        var token = accessToken();
        deferred.resolve(token);
      } else if (tokenState == 'no valid token') {
        login().then(function() {
          var token = accessToken();
          deferred.resolve(token);
        });
      } else if (tokenState == 'connection error') {
        deferred.reject();
      }
    });

    return deferred.promise;
  };

  var lazyLoadingOwnId = function() {
    var deferred = $q.defer();

    var key = 'fbownid';
    var storedId = LocalStorageService.read(key);

    if (storedId) {
      deferred.resolve(storedId);
      return deferred.promise;
    }

    var resolveAndSave = function(result) {
      LocalStorageService.write(key, result.id);
      deferred.resolve(result.id); 
    };

    var apiParameter = {
      path: '/me', 
      success: resolveAndSave, 
      params: {
        fields: "id", 
        limit: 1, 
        offset: 0,
      }
    };

    validatedAccessToken().then(function() {
      openFB.api(apiParameter);
    }, function(error) {
      deferred.reject(error);
    });

    return deferred.promise;
  };

  var getPersonInfo = function(facebookId) {
    var deferred = $q.defer();

    var apiParameter = {
      path: '/' + facebookId, 
      success: function(result) { deferred.resolve(result); }, 
      params: {
        fields: "name,picture.width(200).height(200)", 
        limit: 1, 
        offset: 0,
      }
    };

    validatedAccessToken().then(function() {
      openFB.api(apiParameter);
    });

    return deferred.promise;
  };

  return {
    getOwnId: lazyLoadingOwnId,
    getValidatedAccessToken: validatedAccessToken,
    getTokenState: getTokenState,
    login: login,
    getPersonInfo: getPersonInfo,
  };
})
