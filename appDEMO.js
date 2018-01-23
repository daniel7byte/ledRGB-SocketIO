/*

ESTE ARCHIVO EXPLICA COMO FUNCIONA SOCKET.IO

*/

'use strict';

const five = require('johnny-five');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let led = null;

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html')
});

let state = {
  red: 1, green: 1, blue: 1
};

// Map pins to digital inputs on the board
led = {
  color: {
    red: 6,
    green: 3,
    blue: 5
  }
};

// Helper function to set the colors
let setStateColor = function(state) {
  led = {
    color: {
      red: state.red,
      blue: state.blue,
      green: state.green
    }
  };
};

// Listen to the web socket connection
io.on('connection', function(client) {
  client.on('join', function(handshake) {
    console.log(handshake);
  });

  // Set initial state
  setStateColor(state);

  // Every time a 'rgb' event is sent, listen to it and grab its new values for each individual colour
  client.on('rgb', function(data) {

    console.log(data);

    // En esta condicional no hay problema de que el valor sea 1 porque ya los valores se han modificado
    // con la variable state de la parte de arriba
    state.red = data.color === 'red' ? data.value : state.red;
    state.green = data.color === 'green' ? data.value : state.green;
    state.blue = data.color === 'blue' ? data.value : state.blue;

    console.log(led);
    // Set the new colors
    setStateColor(state);
    console.log(led);

    // QUE ES
    client.emit('rgb', data);
    client.broadcast.emit('rgb', data);
  });

  // Turn on the RGB LED
  // led.on();
});

const port = process.env.PORT || 3000;

server.listen(port);
console.log(`Server listening on http://localhost:${port}`);
