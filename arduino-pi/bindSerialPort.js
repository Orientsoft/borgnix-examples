var SerialPort = require('serialport').SerialPort
  , bindPhysical = require('../index').bindPhysical
  , mqtt = require('mqtt')
  , SERIAL_PORT = process.env.SERIAL_PORT || '/dev/ttyACM0'

  // create an mqtt client
  , options = { 'host': 'YOUR_MQTT_HOST'
              , 'port': 'YOUR_MQTT_PORT'
              , 'username': 'USERNAME'
              , 'password': 'PASSWORD'
              }
  , client = mqtt.connect(options)

client.on('connect', function() {
  console.log('mqtt connected')
})

client.on('error', function (err) {
  console.log(err)
})

// create a local serial port
var serialPort = new SerialPort(SERIAL_PORT,{
    baudrate: 57600,
    buffersize: 1
})

// bind the serial port to the mqtt client
bindPhysical({
  serialPort: serialPort,
  client: client,
  transmitTopic: 'serialClient',
  receiveTopic: 'physicalDevice'
})
