angular.module('cute.services')
  .factory('PushNotificationService', function ($rootScope, $timeout, Constants, Secrets, FacebookService) {

    var handleRegisteredMessage = function(message) {

      var tryAgainLater = function() {
        $timeout(function() {
          handleRegisteredMessage(message);
        }, Constants.MillisecondsPerMinute);
      };

      if (message.regid.length > 0) {
        FacebookService.getOwnId().then(function (myFacebookId) {
          var mobileClient = new WindowsAzure.MobileServiceClient(Secrets.MobileServiceUrl, Secrets.MobileServiceAppKey);
          var hub = new NotificationHub(mobileClient);
          var receivingTags = [myFacebookId];
          var templateName = 'myTemplate';
          var template = '{ "data": {"message": "$(message)", "matchId": "$(matchId)"}}';
          hub.gcm.register(message.regid, receivingTags, templateName, template)
            .done(function () { })
            .fail(tryAgainLater);
        }, tryAgainLater);
      }
    };

    var handleGcmNotification = function(data) {
      var message = data.message;
      switch (message.event) {
      case 'registered':
        handleRegisteredMessage(message);
        break;

      case 'message':
        $rootScope.$broadcast(Constants.MessageHeartReceived, { message: message.payload.matchId });
        break;

      case 'error':
        alert('GCM error: ' + message.message);
        break;

      default:
        alert('An unknown GCM event has occurred');
        break;
      }
    };

    var register = function() {
      window.plugins.pushNotification.register(function() {
        // alert('registered');
      }, function(f) {
        alert(f);
      }, {
        "senderID": Secrets.GoogleCloudMessagingSenderId,
        "ecb": "onNotificationGCM"
      });
    };

    return {
      register: register,
      onGcmNotification: handleGcmNotification,
    };
  });
