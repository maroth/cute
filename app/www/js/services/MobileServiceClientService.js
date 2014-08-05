angular.module('cute.services')
  .factory('MobileServiceClientService', function ($q, Constants, Secrets, FacebookService) {

    var mobileServiceClient = new WindowsAzure.MobileServiceClient(
      Secrets.MobileServiceUrl,
      Secrets.MobileServiceAppKey
    );

    return {
      getFriendsUsingCute: getFriendsUsingCute,
    };

    function getFriendsUsingCute() {
      var deferred = $q.defer();

      FacebookService.getValidatedAccessToken().then(invokeApi);

      return deferred.promise;

      function invokeApi(token) {
        var apiCallParams = {
          body: null,
          method: 'get',
          parameters: {
            fbAccessToken: token
          }
        };

        mobileServiceClient.invokeApi('getfriendsusingcute', apiCallParams)
          .done(apiCallSuccess, apiCallError);
      }

      function apiCallSuccess(result) {
        var friends = JSON.parse(result.response).friends;
        angular.forEach(friends, function (value) {
          value.heartState = Constants.HeartState.NONE;
        });
        deferred.resolve(friends);
      }

      function apiCallError(error) {
        deferred.reject(error.message);
      }
    }
  });
