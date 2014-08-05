angular.module('cute.services')
  .factory('PushNotificationService', function ($rootScope, $timeout, Constants, Secrets, FacebookService) {

    return {
      register: register,
      onGcmNotification: handleGcmNotification,
    };

    function register() {
      window.onNotificationGCM = function (message) {
        angular.element(document.body).injector().get('$rootScope').$broadcast(Constants.MessageGcmReceived, { message: message });
      }

      window.plugins.pushNotification.register(function () {
        //alert('registered');
      }, function (f) {
        alert(f);
      }, {
        "senderID": Secrets.GoogleCloudMessagingSenderId,
        "ecb": "onNotificationGCM",
      });
    }

    function handleGcmNotification(data) {
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
    }

    function handleRegisteredMessage(message) {

      if (message.regid.length > 0) {
        FacebookService.getOwnId().then(handleMessage, tryAgainLater);
      }

      function handleMessage(myFacebookId) {
        var mobileClient = new WindowsAzure.MobileServiceClient(Secrets.MobileServiceUrl, Secrets.MobileServiceAppKey);
        var hub = new NotificationHub(mobileClient);
        var receivingTags = [myFacebookId];
        var templateName = 'myTemplate';
        var template = '{ "data": {"message": "$(message)", "matchId": "$(matchId)"}}';
        hub.gcm.register(message.regid, receivingTags, templateName, template)
          .done(function () { })
          .fail(tryAgainLater);
      }

      function tryAgainLater() {
        $timeout(handleMessage, Constants.MillisecondsPerMinute);

        function handleMessage() {
          handleRegisteredMessage(message);
        }
      };
    }
  });
