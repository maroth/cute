angular.module('cute.services')
.factory('FacebookService', function ($resource, $q, Constants, Secrets, LocalStorageService) {
  var tokenStore = {};
  tokenStore[Constants.AccessTokenKey] = LocalStorageService.read(Constants.AccessTokenKey);
  openFB.init(Secrets.FacebookAppId, undefined, tokenStore);

  return {
    getOwnId: getOwnId,
    getValidatedAccessToken: getValidatedAccessToken,
    getTokenState: getTokenState,
    login: login,
    getPersonInfo: getPersonInfo,
  };

  function getOwnId() {
    var deferred = $q.defer();

    var storedId = LocalStorageService.read(Constants.OwnFacebookIdKey);
    if (storedId) {
      deferred.resolve(storedId);
      return deferred.promise;
    }

    var apiParameter = {
      path: '/me',
      success: resolveAndSave,
      params: {
        fields: "id",
        limit: 1,
        offset: 0,
      }
    };

    getValidatedAccessToken().then(makeApiCall, handleError);

    return deferred.promise;

    function makeApiCall() {
      openFB.api(apiParameter);
    }

    function handleError(error) {
      deferred.reject(error);
    }

    function resolveAndSave(result) {
      LocalStorageService.write(Constants.OwnFacebookIdKey, result.id);
      deferred.resolve(result.id);
    }
  }

  function getValidatedAccessToken() {
    var deferred = $q.defer();

    getTokenState().then(handleTokenState);

    function handleTokenState(tokenState) {
      if (tokenState === Constants.TokenStates.VALID) {
        resolve();
      } else if (tokenState == Constants.TokenStates.INVALID) {
        login().then(resolve);
      } else if (tokenState == Constants.TokenStates.CONNECTION_ERROR) {
        deferred.reject();
      }
    }

    function resolve() {
      var token = getCachedAccessToken();
      deferred.resolve(token);
    }

    return deferred.promise;
  }

  function getTokenState() {
    var deferred = $q.defer();

    var token = getCachedAccessToken();

    if (typeof (token) === typeof (undefined)) {
      deferred.resolve(Constants.TokenStates.INVALID);
    } else {
      getArbitraryDataFromFacebookToTestToken(handleSuccess, handleError);
    }

    function handleSuccess() {
      deferred.resolve(Constants.TokenStates.VALID);
    }

    function handleError(error) {
      if (error.type == 'OAuthException') {
        deferred.resolve(Constants.TokenStates.INVALID);
      } else {
        deferred.resolve(Constants.TokenStates.CONNECTION_ERROR);
      }
    }

    function getArbitraryDataFromFacebookToTestToken(success, error) {
      openFB.api({
        path: '/me',
        params: { fields: 'id', limit: 1, offset: 0 },
        success: success,
        error: error,
      });
    };

    return deferred.promise;
  }

  function login() {
    var deferred = $q.defer();

    openFB.login(Constants.FacebookPermissions, handleSuccess);

    function handleSuccess() {
      var token = getCachedAccessToken();
      LocalStorageService.write(Constants.AccessTokenKey, token);
      deferred.resolve();
    }

    return deferred.promise;
  }

  function getPersonInfo(facebookId) {
    var deferred = $q.defer();

    var apiParameter = {
      path: '/' + facebookId,
      success: handleSuccess,
      params: {
        fields: "name,picture.width(200).height(200)",
        limit: 1,
        offset: 0,
      }
    };

    getValidatedAccessToken().then(makeApiCall, handleError);

    return deferred.promise;

    function makeApiCall() {
      openFB.api(apiParameter);
    }

    function handleSuccess(result) {
      deferred.resolve(result);
    }

    function handleError(error) {
      deferred.reject(error);
    }
  }

  function getCachedAccessToken() {
    return tokenStore[Constants.AccessTokenKey];
  }
})
