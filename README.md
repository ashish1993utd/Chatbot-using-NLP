![Stars](https://img.shields.io/github/stars/ashish1993utd/Chatbot-using-NLP.svg?style=social)
![Forks](https://img.shields.io/github/forks/ashish1993utd/Chatbot-using-NLP.svg?style=social)
![Language](https://img.shields.io/github/languages/top/ashish1993utd/Chatbot-using-NLP.svg)
[![GitHub](https://img.shields.io/github/license/ashish1993utd/Chatbot-using-NLP.svg)](https://choosealicense.com/licenses/mit)
[![HitCount](http://hits.dwyl.io/ashish1993utd/Chatbot-using-NLP.svg)](http://hits.dwyl.io/ashish1993utd/Chatbot-using-NLP)

## Demo
![Example screenshot](./img/demo.gif)

**The entire demo of the project can be found on [YouTube](http://bit.ly/2XxdRjb).**


## Screenshots

![Example screenshot](./img/1.PNG)
![Example screenshot](./img/2.PNG)
![Example screenshot](./img/3.PNG)
![Example screenshot](./img/4.PNG)

## Technologies and Tools
* SQL Server 
* Node.js
* JavaScript
* LUIS
 
## Code Examples

````
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
  appId:'',
  appPassword:''
});

var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage);
server.post('/api/messages',connector.listen()); // This registers bot service object on publically 
// accessible api/messages http end point where node.js will be running


// init bot system module and connect to MySQL Database
var system = new BotSystem();
system.connectToDB(); 

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

````

## Status
Project is: _finished_.  

## Contact
If you loved what you read here and feel like we can collaborate to produce some exciting stuff, or if you
just want to shoot a question, please feel free to connect with me on 
<a href="mailto:nick22910@gmail.com">email</a> or 
<a href="https://www.linkedin.com/in/ashishsharma1993/" target="_blank">LinkedIn</a>
