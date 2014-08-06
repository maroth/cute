angular.module('cute', ['ionic', 'cute.services', 'cute.controllers', 'cute.exceptionHandler'])
.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('init', {
      url: '/init',
      templateUrl: 'templates/init.html',
      controller: 'initController',
    })
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
    });

  $urlRouterProvider.otherwise('/init');

});


