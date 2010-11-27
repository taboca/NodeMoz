#!/usr/bin/env node

var sys = require('sys');
var irc = require('../vendor/irc');
var arrays = require('../vendor/arrays');
var ws  = require("../vendor/ws");

var bot = new irc.Client('irc.dollyfish.net.nz', 'myusername', { debug: true, channels: ['#testwebsockets'], });

bot.addListener('error', function(message) {
    sys.puts('ERROR: ' + message.command + ': ' + message.args.join(' '));
});

bot.addListener('message#blah', function (from, message) {
    sys.puts('<' + from + '> ' + message);
});

bot.addListener('message', function (from, to, message) {
    sys.puts(from + ' => ' + to + ': ' + message);

    if ( to.match(/^[#&]/) ) {
        clients.each(function(c) { c.write(message); });
    }
    else {
        // private message
    }
});
bot.addListener('pm', function(nick, message) {
    sys.puts('Got private message from ' + nick + ': ' + message);
});
bot.addListener('join', function(channel, who) {
    sys.puts(who + ' has joined ' + channel);
});
bot.addListener('part', function(channel, who, reason) {
    sys.puts(who + ' has left ' + channel + ': ' + reason);
});
bot.addListener('kick', function(channel, who, by, reason) {
    sys.puts(who + ' was kicked from ' + channel + ' by ' + by + ': ' + reason);
});

var clients = [];
ws.createServer(function (websocket) {
  clients.push(websocket);
  websocket.addListener("connect", function (resource) {
    sys.debug("connect: " + resource);
  });
  websocket.addListener("close", function () {
    clients.remove(websocket);
    sys.debug("close");
  });
  websocket.addListener("data", function (data) { 
     bot.say("#testwebsockets", data);
  }); 

}).listen(8080);


