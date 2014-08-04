angular.module('cute.controllers')
    .controller('initController', function($state, FacebookService) {
        document.addEventListener('deviceready', function() {
            FacebookService.getTokenState().then(function(tokenState) {
                if (tokenState == 'no valid token') {
                    $state.go('login');
                } else {
                    $state.go('list');
                }
            });
        }, false);
    });