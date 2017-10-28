var restify = require('restify');
var builder = require('botbuilder');


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [
    function (session) {
        builder.Prompts.text(session, "Hi! This is SUREBot! To get started, what's your first name and UTEID (separate by a space e.g. Jason he1881)?");
    },
    function (session, results) {
        var string = results.response.split(" ");
        var name = string[0];
        var UTEID = string[1];
        session.dialogData.userName = name;
        session.dialogData.eid = UTEID;
        builder.Prompts.text(session, `Hi, ${session.dialogData.userName}. Where do you want to be picked up?`);
    },
    function (session, results) {
        session.dialogData.pickUp = results.response;
        builder.Prompts.text(session, "Gotcha. Now, to what address do you want to go?");
    },
    function (session, results) {
        session.dialogData.dropOff = results.response;
        builder.Prompts.text(session, "Great! One last thing, what’s the best number to contact you at?");
    },
    function (session, results){
        session.dialogData.phone = results.response;
        session.send("Thanks! Someone from SUREWalk will contact you soon! :) Hook’em \\m/");
        session.dialogData.volunteer = "Bot";
        session.dialogData.status = "Open";
        session.endDialog();
    }
]);