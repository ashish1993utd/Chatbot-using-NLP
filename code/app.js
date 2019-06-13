var builder = require('botbuilder');
var restify = require('restify');
// var connector = new builder.ConsoleConnector().listen();
// var bot = new builder.UniversalBot(connector);

// Bot Modules
var BotSystem = require('./bot_core/system.js');

//====================================================
// BOT SETUP
//====================================================

// Setup Restify Server: Create a new server instance
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening...',server.name);
});


//Create CHATBOT
var connector = new builder.ChatConnector({
    appId: '3f3e77a1-f915-4e5d-8ffa-0010b29fa8de',
    appPassword: 'qjdpBW80#(%hyxXDUGL810!'
  //appId:'',
  //appPassword:''
});


var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage);
server.post('/api/messages',connector.listen()); // This registers bot service object on publically 
// accessible api/messages http end point where node.js will be running


// init bot system module and connect to MySQL Database
var system = new BotSystem();
system.connectToDB(); 


//====================================================
// BOT DIALOG
//====================================================

/*
bot.dialog('/',[
    function (session,args,next) {
        if(!session.userData.name){
            session.beginDialog('/ask_name');
        }
        else{
            next();
        }
    },
    function (session) {
        session.send('Hello %s... Ask me a question',session.userData.name);
    }
]);

*/
bot.dialog('/ask_name',[
    function (session) {
    builder.Prompts.text(session,'Hi! What is your name?');
    },
    function (session,results) {
        session.userData.name=results.response;  
        session.endDialog();
    }
]);

bot.dialog('/yes_cricket',[
    function (session) {    
        builder.Prompts.text(session,'All Right! What is your question?');
    },

    function (session,results) {
        session.userData.question=results.response; 
        system.checkques(session);
    }
]);

bot.dialog('/more_ques',[
    function (session) {    
        builder.Prompts.text(session,'Have any other question? \n Yes | No');
    },

    function (session,results,next) {
        session.userData.moreques=results.response; 
        next();    
    },
    function(session){
        if(session.userData.moreques==='Yes'){
            session.beginDialog('/yes_cricket');
        }
        else if(session.userData.moreques==='No'){
            session.send('Bye!!');
            session.endDialog();
        }
        else{
            session.send("Sorry I didn't get you");
            session.beginDialog('/more_ques');
        }

    }
]);



bot.dialog('/misc',[
    function (session) {    
        builder.Prompts.text(session,'Please choose one of the options \n Any question about cricket? Yes|No');
    },
 function(session,results){
    if(results.response==='Yes'){
        session.beginDialog('/yes_cricket');
    } 
    else if(results.response==='No'){
        session.send('Bye! Have a great day!');
        session.endDialog();
    }    
    else{
        session.beginDialog('/misc');
        }
    }
]);


//==================================================================================
// 
//=================================================================================


var intents = new builder.IntentDialog();
bot.dialog('/',intents);

intents.onDefault([
    function (session,args,next) {
        if(!session.userData.name){
            session.beginDialog('/ask_name');
        }
        else{
            next();
        }
    },
    function (session) {
        session.send('Hello %s...',session.userData.name);
        builder.Prompts.text(session,'Have questions on cricket? \n Yes | No');  
    }
    ,

    function (session,results) {
        if(results.response==='Yes'){
            session.beginDialog('/yes_cricket');
        } 
        else if(results.response==='No'){
            session.send('Bye! Have a good day!');
        }    
        else{
            session.beginDialog('/misc');
            }
    }    
]);

intents.matches(/^change name/i,[
    function(session){
        session.beginDialog('/ask_name');
    },
    function(session,results){
        session.send('ok... Changed your name to %s',session.userData.name);
    }    
]);


//======================
// Sending Bot version
intents.matches(/^version/i,builder.DialogAction.send('Bot Version 1.0.0'));
//======================






//==================================================================================
// Basic message from Console - Hello World
//=================================================================================


/*var builder = require('botbuilder');
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

bot.dialog('/', function (session){
    session.send('Hello World');
});
*/
