angular.module('cute.services')
  .factory('HeartService', function ($resource, Secrets) {
    var options = {
      post: {
        method: 'POST',
        headers: {
          'X-ZUMO-APPLICATION': Secrets.MobileServiceAppKey,
          'Content-Type': 'Application/json'
        }
      }
    };

    var heartResource = $resource('https://cute.azure-mobile.net/tables/heart', {}, options);
    return heartResource;
  });