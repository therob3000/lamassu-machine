'use strict';

var serialPort = require('serialport');
var SerialPort = serialPort.SerialPort;

var crypto    = require('crypto');

//var device = '/dev/ttySP0';
var device = '/dev/tty.NoZAP-PL2303-00305414';

var key = '489f4ed08b03402005c81a7ea8255017aacaf33a7d78fcd4f931014c9dd991c0';

var serial = new SerialPort(device,
    {baudRate: 115200, dataBits: 8, stopBits: 1});

serial.on('error', function(err) { console.log(err); });
serial.on('open', function () {
  serial.on('data', function(data) {  console.log(data.toString()); });
  console.log('connected');
  setInterval(function() {
    console.log('compute start');
    var rand = Math.random();
    var msg = JSON.stringify({amount: 40, nonce: rand});
    var hmac = computeHmac(key, msg);
    var payload = JSON.stringify({
      body: msg,
      hmac: hmac
    });
    serial.write(JSON.stringify(payload));
    console.log('compute end');
  }, 1000);
});


function computeHmac(key, msg) {
  var algorithm = 'sha256';
  var hmac = crypto.createHmac(algorithm, key);
  hmac.setEncoding('hex');
  hmac.write(msg);
  hmac.end();
  return hmac.read();
}
