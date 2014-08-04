angular.module('cute.services')
  .factory('MobileServiceClientService', function ($q, Secrets, FacebookService) {
    var mobileServiceClient = new WindowsAzure.MobileServiceClient(
      Secrets.MobileServiceUrl,
      Secrets.MobileServiceAppKey
    );

    var getFriendsUsingCute = function() {
      var deferred = $q.defer();

      var apiCallSuccess = function(result) {
        var friends = JSON.parse(result.response).friends;
        angular.forEach(friends, function(value) {
          value.heartState = 'none';
        });
        deferred.resolve(friends);
      };

      var apiCallError = function(error) {
        deferred.reject(error.message);
      };

      FacebookService.getValidatedAccessToken().then(function(token) {
        var apiCallParams = {
          body: null,
          method: 'get',
          parameters: {
            fbAccessToken: token
          }
        };

        mobileServiceClient.invokeApi('getfriendsusingcute', apiCallParams)
          .done(apiCallSuccess, apiCallError);
      });

      return deferred.promise;
    };

    return {
      getFriendsUsingCute: getFriendsUsingCute,
      mobileServiceClient: mobileServiceClient,
    };
  });
