const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" } // React app URL
});

// IMPORTANT: Change this to your Arduino's COM port (e.g., 'COM3' or 'COM5')
// Check the Arduino IDE to see which COM port your Arduino Uno is connected to.
const ARDUINO_PORT = 'COM4'; 

try {
  const port = new SerialPort({ path: ARDUINO_PORT, baudRate: 9600 });
  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  parser.on('data', (data) => {
    try {
      const sensorData = JSON.parse(data);
      console.log('Received from Arduino:', sensorData);
      io.emit('sensor_update', sensorData);
    } catch (err) {
      console.log('Received raw text (NOT JSON):', data);
    }
  });

  port.on('error', (err) => {
    console.log('Serial Port Error:', err.message);
    console.log('Make sure your Arduino is plugged in and the COM port is correct.');
  });
} catch (err) {
  console.log('Serial port initialization failed:', err.message);
}

io.on('connection', (socket) => {
  console.log('React Dashboard Connected');
});

server.listen(5001, () => {
  console.log('Backend listening on port 5001');
  console.log('Waiting for Arduino data on ' + ARDUINO_PORT + '...');
});
