angular.module('cute', ['ionic', 'cute.services', 'cute.controllers', 'cute.exceptionHandler'])

.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('list', {
      url: '/list',
      templateUrl: 'templates/list.html',
      controller: 'listController'
    })

    .state('match', {
      url: '/match/',
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
      templateUrl: 'templates/init.html',
      controller: 'initController',
    });

  $urlRouterProvider.otherwise('/init');

});


