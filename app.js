'use strict';
// Module Dependencies
// -------------------
var express     = require('express');
var bodyParser  = require('body-parser');
var errorhandler = require('errorhandler');
var http        = require('http');
var path        = require('path');
var request     = require('request');
var routes      = require('./routes');
var activity    = require('./routes/activity');
var util = require('util');
const SFClient = require('./utils/sfmc-client');

var app = express();

// Configure Express
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json({type: 'application/json'})); 
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.methodOverride());
//app.use(express.favicon());

app.use(express.static(path.join(__dirname, 'public')));

// Express in Development Mode
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

// HubExchange Routes
app.get('/', routes.index );
app.post('/login', routes.login );
app.post('/logout', routes.logout );

app.post('/inboundmsg',function(req,res){
  console.log(req.body);
  console.log('request------------->'+req);
  console.log("Reply Body:"+res);
  
  try
     {
         SFClient.saveData(process.env.DATA_EXTENSION_EXTERNAL_KEY2, [
                        {
                        keys: {
                          Id: req.body.SmsMessageSid+' '+req.body.To
                        },
                        values: {
                           
                         Body:req.body.Body,
                         SmsMessageSid:req.body.SmsMessageSid,
                         From:req.body.From,
                         To:req.body.To
                        },
                      }
                    ]);
               }
                catch(err)   
               {
                   console.log(err);
                }
});

// Custom Hello World Activity Routes
app.post('/journeybuilder/save/', activity.save );
app.post('/journeybuilder/validate/', activity.validate );
app.post('/journeybuilder/publish/', activity.publish );
app.post('/journeybuilder/execute/', activity.execute );

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
