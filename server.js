'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//DNS endpoint
var dns = require('dns');
const url = require('url');
var i = 0;
var map = [];

app.post("/api/shorturl/new", function (req, res) {
  
  var ret = {};
  var myurl = url.parse(req.body.url);

  dns.lookup( myurl.host , function (err, addresses) {
    if (err) {
      ret.error = 'invalid URL';
      res.json(ret);
    }else{      
      map[i] = req.body.url;
      ret.original_url = req.body.url;
      ret.short_url = i;
      i++;
      res.json(ret);
    };
    //console.log('addresses: ' + JSON.stringify(addresses));
  });

});

app.get('/api/shorturl/:int', function(req, res){
  
  var response = {};
  //response.echo = req.params.int;    
  response.url = map[req.params.int];
  if(response.url == undefined){
    response.error = 'invalid short URL';
    res.json( response );  
  }else{
    res.redirect(response.url);
  }
  
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});