angular.module('cute.services')
  .factory('CheckinService', function($resource, Secrets) {
    return $resource('https://cute.azure-mobile.net/tables/checkin', {}, {
      post: {
        method: 'POST',
        headers: {
          'X-ZUMO-APPLICATION': Secrets.MobileServiceAppKey,
          'Content-Type': 'Application/json'
        }
      }
    });
  });
  
