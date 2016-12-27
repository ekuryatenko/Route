"use strict";

/** GOOGLE LIBRARIES  ***************************/
// Imports the Gmail client library
var google = require('googleapis');

module.exports = function () {
    return {
        /** Error handler support */
        subscribtionPushHandler: function (request, reply) {
            reply('OK');

            var data = request.payload;

            console.log("GET MESSAGE FROM PUBSUB:");
            console.log(data);
            console.log("****************************");
        },

        subscribtionPullConnection: function (auth, LAST_HISTORY_ID) {
            // Imports the Google Cloud client library
            var PubSub = require('@google-cloud/pubsub');

            // Your Google Cloud Platform project ID
            var projectId = '257651999562';

            // Instantiates a client
            var pubsubClient = PubSub({
                projectId: projectId
            });

            var topic = pubsubClient.topic('myTopic2');
            var subscription = topic.subscription('MySub2');

            // Register an error handler.
            subscription.on('error', function (err) {
                console.error("SUBSCRIBTION ERROR: ", err);
            });

            // Register a listener for `message` events.
            function onMessage(message) {
                // Called every time a message is received.

                // message.id = ID of the message.
                // message.ackId = ID used to acknowledge the message receival.



                // Ack the message:
                message.ack(function () {
                    if(message.data.emailAddress){
                        printEmail(auth, message, LAST_HISTORY_ID);
                    }else{
                        console.log("PUBSUB GET MSG: ", message.data);
                    }
                });

                // Skip the message. This is useful with `maxInProgress` option when
                // creating your subscription. This doesn't ack the message, but allows
                // more messages to be retrieved if your limit was hit.
                // message.skip();
            }

            subscription.on('message', onMessage);
        }
    };

    function printEmail(auth, message, LAST_HISTORY_ID){
            console.log("PUBSUB GET EMAIL: ", message.data);

            // GET valid historyId: http://stackoverflow.com/questions/32248048/gmail-history-list-is-not-giving-complete-data
            //var emailHistoryId = message.data.historyId;

            var gmail = google.gmail('v1');
            /** GMAIL REQUEST******************************** */
            gmail.users.history.list({
                auth: auth,
                userId: 'me',
                startHistoryId: LAST_HISTORY_ID
            }, function (err, response) {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    return;
                }

                var historyArr = response.history;
                LAST_HISTORY_ID = response.historyId;

                //console.log(historyArr);

                var lastHistory = historyArr[historyArr.length-1];
                var msgs = lastHistory.messages;
                var lastMsg = msgs[msgs.length-1];

                //console.log(msgs[msgs.length-1]);

                       gmail.users.messages.get({
                            auth: auth,
                            userId: 'me',
                            id: lastMsg.id
                        }, function (err, response) {
                            if (err) {
                                console.log('The API returned an error: ' + err);
                                return;
                            }

                            var headersArr = response.payload.headers;

                            for(var item3 of headersArr) {
                                if(item3.name == "From")
                                console.log(item3.value);
                            }

                        })
            });
            /** GMAIL REQUEST******************************** */
        }
}();


