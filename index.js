const mqtt = require('mqtt');
const axios = require('axios');

// MQTT Broker Configuration
const mqttBrokerUrl = 'mqtt://mqtt.xxx.com'; // Replace with your MQTT broker URL
const mqttTopic = '#'; 

// HTTPS Endpoint Configuration
const httpsEndpoint = 'https://in.zivyobraz.eu/?import_key=XXXX'; // Replace with your zivyobraz endpoint URL

// MQTT Client Setup
const client = mqtt.connect(mqttBrokerUrl);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(mqttTopic);
});

client.on('message', (topic, message) => {
  // Extract the parameter name and value from the MQTT topic message
  console.log(topic+" "+ message.toString());
    const paramName = topic; // Extract the parameter name
    const paramValue = message.toString(); // Use the message as the parameter value

    // Make an HTTP GET request to the HTTPS endpoint with the extracted parameter name and value as query parameters
    axios
      .get(httpsEndpoint, {
        params: { [paramName]: paramValue },
      })
      .then((response) => {
        console.log('HTTP GET request successful:', response.data);
      })
      .catch((error) => {
        console.error('Error making HTTP GET request:', error.message);
      });
});
client.on('error', (error) => {
  console.error('MQTT error:', error.message);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  client.end();
  process.exit(0);
});