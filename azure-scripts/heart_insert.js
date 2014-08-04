function insert(item, user, request) {
    
    var MILLISECONDS_PER_MINUTE = 60000;
    var MatchRange = MILLISECONDS_PER_MINUTE * 10;

    var getTimeOfLastMatch = function(id1, id2, success) {
        tables.getTable('match')
        .where(function(id1, id2) { 
            return (this.id1 == id1 && this.id2 == id2) || (this.id2 == id1 && this.id1 == id2); 
        }, id1, id2)
        .orderByDescending('time')
        .take(1)
        .read({
            success: function(results) {
                var timeOfLastMatch = 0;
                if (results.length > 0) {
                    timeOfLastMatch = results[0].time;
                }
                success(timeOfLastMatch);
            }
        });
    };
    
    var getTimeOfLastOppositeHeart = function(from, to, success) {
        tables.current
        .where({ from: to, to: from})
        .orderByDescending('time')
        .take(1)
        .read({
           success: function(results) {
               var timeOfLastOppositeHeart = 0;
               if (results.length > 0) {
                   timeOfLastOppositeHeart = results[0].time;
               }
               success(timeOfLastOppositeHeart);
           }, 
        });
    };
    
  
    try {
        getTimeOfLastOppositeHeart(item.from, item.to, function(timeOfLastOppositeHeart) {
            getTimeOfLastMatch(item.from, item.to, function(timeOfLastMatch) {
                
                var oppositeHeartAfterLastMatch = timeOfLastMatch < timeOfLastOppositeHeart;
                var oppositeHeartNearEnough = timeOfLastOppositeHeart > Date.now() - MatchRange;
                var isMatch = oppositeHeartAfterLastMatch && oppositeHeartNearEnough;
                
                console.log("received heart from " + item.from
                    + " to " + item.to 
                    + ". Last match was at " + timeOfLastMatch
                    + " (" + ((Date.now() - timeOfLastMatch) / (1000 * 60)) + " minutes ago)" 
                    + " and last opposite heart was at " + timeOfLastOppositeHeart
                    + " (" + ((Date.now() - timeOfLastOppositeHeart) / (1000 * 60)) + " minutes ago)" 
                    + ". OppositeHeartAfterLastMatch was " + oppositeHeartAfterLastMatch
                    + " and oppositeHeartNearenough was " + oppositeHeartNearEnough
                    + ", leading to isMatch being " + isMatch + ".");
                    
                if (isMatch) {
                    var azure = require('azure');
                    var hub = azure.createNotificationHubService(
                        'cutehub', 
                        'Endpoint=sb://cutehub-ns.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=pSBc5uhKbzLKxjIXM83VjpFIkjMpmNZeypJENIhIXno=');
                    
                    var createMatchInDatabase = function(id1, id2) {
                          console.log('creating match');
                          var match = { 
                              id1: id1, 
                              id2: id2, 
                              time: Date.now()
                          };
                          tables.getTable('match').insert(match);
                    }
    
                    var sendMatchMessage = function(receiver, matchId) {
                        try {
                            console.log("sending heart notification to " + receiver);
                            var payload = '{ "message": "??!", "matchId": "' + matchId + '"}';
                            hub.send(receiver, payload, function(error) {
                                if (error) {
                                    console.log(error);
                                }
                            });
                        } catch (e) {
                            console.log("ERROR sending heart notification to " + receiver + ". " + e.message);
                        }
                    }
                    
                    sendMatchMessage(item.from, item.to);
                    sendMatchMessage(item.to, item.from);
                    createMatchInDatabase(item.from, item.to);
    
                } else {
                }
            });
        });
    } catch (e) {
        console.log(e.stacktrace);
    }
    
    request.execute();
}
