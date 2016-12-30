'use strict';

var Hapi = require('hapi');
var Inert = require("inert");
var Vision = require("vision");
var fs = require('fs');
var readline = require('readline');

/** GOOGLE LIBRARIES  ***************************/
// Imports the Gmail client library
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// Imports the Google Cloud client library
var PubSub = require('@google-cloud/pubsub');

// My handler
var pubSubHelper = require('./pubSub.js');

var AUTH = {};
/** **********************************************/

var server = new Hapi.Server();

// Static files support
server.register (Inert, (err) => {
  if (err) {
    throw err;
  }

  server.register(Vision, (err) => {
    if (err) {
      throw err;
    }

    server.views({
      // Registers the Pug as responsible for rendering of .pug files
      engines: {
        html: require('handlebars')
      },
      // Shows server where templates are located in
      path: __dirname
    });
  });
});

server.connection({ port: process.env.PORT || 3000 });

server.route([{
    method: "GET",
    path: "/googlebc49ae7f9c9ef568.html",
    handler: {
      file: __dirname + "/googlebc49ae7f9c9ef568.html"
    }
  }, {
    method: "POST",
    path: "/_ah/push-handlers/myhandler",
    handler: function handler(request, reply) {
            pubSubHelper.subscribtionPushHandler(request, reply);
        }
    }
]);

server.start(function (err) {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);

    gmailAuth();
});

function gmailAuth() {
    console.log('GmailAuth running...');
    // If modifying these scopes, delete your previously saved credentials
    // at ~/.credentials/gmail-nodejs-quickstart.json
    var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
    var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
    var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Gmail API.
        authorize(JSON.parse(content), requestGmailWatch);
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     *
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function (err, token) {
            if (err) {
                getNewToken(oauth2Client, callback);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                callback(oauth2Client);
            }
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback to call with the authorized
     *     client.
     */
    function getNewToken(oauth2Client, callback) {
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        console.log('Authorize this app by visiting this url: ', authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the code from that page here: ', function (code) {
            rl.close();
            oauth2Client.getToken(code, function (err, token) {
                if (err) {
                    console.log('Error while trying to retrieve access token', err);
                    return;
                }
                oauth2Client.credentials = token;
                storeToken(token);
                callback(oauth2Client);
            });
        });
    }

    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    function storeToken(token) {
        try {
            fs.mkdirSync(TOKEN_DIR);
        } catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to ' + TOKEN_PATH);
    }

    /**
     * Lists the labels in the user's account.
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    function listLabels(auth) {
        var gmail = google.gmail('v1');
        gmail.users.labels.list({
            auth: auth,
            userId: 'me'
        }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            var labels = response.labels;
            if (labels.length == 0) {
                console.log('No labels found.');
            } else {
                console.log('Labels:');
                for (var i = 0; i < labels.length; i++) {
                    var label = labels[i];
                    console.log('- %s', label.name);
                }
            }
        });
    }
}

/**
 *
 */
function listHistory(auth) {
    var gmail = google.gmail('v1');
    gmail.users.messages.list({
        auth: auth,
        userId: 'me'
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var arr = response.messages;
        if (arr.length == 0) {
            console.log('No labels found.');
        } else {
            console.log('Labels:');
            for (var i = 0; i < arr.length; i++) {
                var mes = arr[i];
                console.log('- %s', mes.id, ', %s', mes.internalDate);
            }
        }
    });
}

function requestGmailWatch(auth) {
    AUTH = auth;

    var gmail = google.gmail('v1');

    var options = {
        auth: auth,
        userId: 'crypticlowlands@gmail.com',
        resource: {
            topicName: "projects/cryptic-lowlands-2/topics/myTopic2",
            labelIds: ["INBOX"]
        }
    };

    gmail.users.watch(options, handleWatchResponse);
}

function handleWatchResponse(err, response) {
    if (err) {
        console.log('The API returned an error: ' + err);
        return;
    }

    console.log('GmailAPI watch() request handling...');
    console.log(response);

    pubSubHelper.subscribtionPullConnection(AUTH, response.historyId);
}


function defaultAuth() {
    // This method looks for the GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS
    // environment variables.
    google.auth.getApplicationDefault(function (err, authClient, projectId) {
        if (err) {
            throw err;
        }

        // The createScopedRequired method returns true when running on GAE or a local developer
        // machine. In that case, the desired scopes must be passed in manually. When the code is
        // running in GCE or a Managed VM, the scopes are pulled from the GCE metadata server.
        // See https://cloud.google.com/compute/docs/authentication for more information.
        if (authClient.createScopedRequired && authClient.createScopedRequired()) {
            // Scopes can be specified either as an array or as a single, space-delimited string.
            authClient = authClient.createScoped([
                'https://www.googleapis.com/auth/compute'
            ]);
        }

        // Fetch the list of GCE zones within a project.
        // NOTE: You must fill in your valid project ID before running this sample!
        var compute = google.compute({
            version: 'v1',
            auth: authClient
        });
        var projectId = '257651999562';

        //https://cloud.google.com/compute/docs/regions-zones/regions-zones#zone_deprecation
        compute.zones.list({
            project: projectId,
            auth: authClient
        }, function (err, result) {
            console.log(err, result);
        });
    });
}