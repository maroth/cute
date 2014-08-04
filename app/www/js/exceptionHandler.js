angular.module('cute.exceptionHandler', []).factory('$exceptionHandler', function () {
  return function (exception, cause) {
    exception.message += ' (caused by "' + cause + '")';
    exception.message += ' (stack: "' + exception.stack + '")';
    alert(exception.message);
  };
});
