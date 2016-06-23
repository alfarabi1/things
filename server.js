//index.js

//reading data from com port 3 COM3
//whihc is the arduino outputting sensor information

var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var fs = require('fs');
//serial port works
var Serial = require("serialport");
var SerialPort = require("serialport").SerialPort;
var Twitter = require('twitter');
 

//--------------------------- Twitter --------------------------------

//var tweet = require('.components/tweet');
var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});
 
var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
    console.log(tweets);
  }
});
//-------------------------- End Twitter ------------------------------

//configure what serial port reads
var serialport = new SerialPort('COM3', {
  parser: Serial.parsers.readline('\n') //reads up to new line instead of random data chunks
});

//list serialport properties
Serial.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});


//read serial port data and write to file
serialport.on('open', function(){
  console.log('Serial Port Opend');
  serialport.on('data', function(data){
    console.log(data.toString());
    //write data to txt file
    fs.writeFile('input.txt',  data.toString(), {'flag':'a+'},  function(err) {
			if (err) {
			   return console.error(err);
			}
		});
  });//end serialport.on data

});//end serialport.on open



//some web functionality 
app.get('/stop', function(req, res){
	console.log('closing port');
	res.send('closing port');
	serialport.close(function(err){
		console.log(err);
	});
});

app.get('/open', function(req, res){
	res.send('opening port');
	if(serialport.isOpen()){
		res.send('<div>port is already open<div>');
	}
	else{
		serialport.open();
		res.send('<div>port opened<div>');
			fs.readFile('input.txt', function (err, data) {
	      if (err) {
	         return console.error(err);
	      }
	      console.log("readFile: " + data.toString());
	   	});
	}
});

app.get('/file',function(req,res){
	fs.readFile('input.txt', function (err, data) {
    if (err) {
       return console.error(err);
    }
    console.log("readFile: " + data.toString());
 	});
	res.sendFile(path.join(__dirname+'/input.txt'));
});

app.get('/twitter', function(req,res){
	res.send('twitter');
});

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname+'/index.html'));
});


//Express Server
//server on port 3000
app.listen(3000,function(){
	console.log ('express server on port 3000');
});




