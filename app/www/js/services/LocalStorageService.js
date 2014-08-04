angular.module('cute.services')
  .factory('LocalStorageService', function() {
    return {
      read: function(key) {
        return window.localStorage[key];
      },

      write: function(key, value) {
        window.localStorage[key] = value;
      },

      delete: function(key) {
        window.localStorage.removeItem(key);
      },
    };
  });