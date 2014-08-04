angular.module('cute.services')
  .factory('HeartService', function($resource, Secrets) {
    return $resource('https://cute.azure-mobile.net/tables/heart', {}, {
      post: {
        method: 'POST',
        headers: {
          'X-ZUMO-APPLICATION': Secrets.MobileServiceAppKey,
          'Content-Type': 'Application/json'
        }
      }
    });
  });