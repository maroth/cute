angular.module('cute.services')
  .factory('LocalStorageService', function () {
    return {
      read: read,
      write: write,
      delete: remove,
    };

    function read(key) {
      return window.localStorage[key];
    }

    function write(key, value) {
      window.localStorage[key] = value;
    }

    function remove(key) {
      window.localStorage.removeItem(key);
    }
  });