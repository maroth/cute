exports.get = function(request, response) {
    var getParams = require('url').parse(request.url, true).query;
    var fbAccessToken = getParams.fbAccessToken;
    var req = require('request');
    var url = 'https://graph.facebook.com/me/friends?fields=id,name,picture&limit=5000&offset=0&access_token=' + fbAccessToken;
   
    req(url, function(err, resp, body){
        if(err||resp.statusCode !== 200) {
            console.error('Error sending data to FB Graph API: ', err);
            request.respond(statusCodes.INTERNAL_SERVER_ERROR, body);
        } else{
            try{
                var fbResponse = JSON.parse(body);
                var friendIds = [];
                var friendCache = {};
                fbResponse.data.forEach(function(entry) {
                    friendIds.push(entry.id);
                    friendCache[entry.id] = { 
                        name: entry.name, 
                        pictureUrl: entry.picture.data.url 
                    };
                });
                
                var sqlParams = ["('" + friendIds.join("', '") + "')"];
                var sql = "SELECT facebook_id FROM checkin WHERE facebook_id IN " + sqlParams + " GROUP BY facebook_id;";
                
                request.service.mssql.query(sql, null, {
                    success: function(results) {
                        var friendWithCheckinIds = [];
                        results.forEach(function(entry) {
                           friendWithCheckinIds.push({ 
                               id: entry.facebook_id,
                               pictureUrl: friendCache[entry.facebook_id].pictureUrl,
                               name: friendCache[entry.facebook_id].name,
                           }); 
                        });
                        request.respond(statusCodes.OK, { friends : friendWithCheckinIds });
                    },
                    error: function(err) {
                        console.log("error is: " + err);
                        request.respond(statusCodes.INTERNAL_SERVER_ERROR);
                    }   
                });
            } catch(ex){
                console.error('Error parsing response from FB Graph API: ', ex);
                request.respond(statusCodes.INTERNAL_SERVER_ERROR, ex);
            }
        }
    });
};
