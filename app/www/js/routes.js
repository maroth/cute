angular.module('cute', ['ionic', 'cute.services', 'cute.controllers', 'cute.exceptionHandler'])

.config(['$httpProvider', function($httpProvider) { 
  $httpProvider.defaults.headers.common['X-ZUMO-APPLICATION'] = 'jGASrSNilTcgVpFipWXJgRxPmtsRCF47';
  $httpProvider.defaults.headers.common['Content-Type'] = 'Application/json';
}])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('list', {
      url: '/list',
      templateUrl: 'templates/list.html',
      controller: 'listController'
    })

    .state('match', {
      url: '/match/:matchId',
      templateUrl: 'templates/match.html',
      controller: 'matchController',
    })

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginController',
    })

    .state('init', {
      url: '/init',
      controller: 'initController',
    });

  $urlRouterProvider.otherwise('/init');

});

function onNotificationGCM(e) {
  angular.element(document.body).injector().get('$rootScope').$broadcast('GcmNotification', { message: e });
}


