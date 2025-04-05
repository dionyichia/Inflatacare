// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { ArduinoIoTCloud } = require('arduino-iot-js');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Update with your frontend URL in production
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Enable CORS for REST API
app.use(cors());
app.use(express.json());

// Arduino IoT Cloud credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const THING_ID = process.env.THING_ID;
const SENSOR_PROPERTIES = ['fRS1', 'fRS2', 'fRS3', 'fRS4', 'fRS5', 'fRS6', 'highestAccTime', 'alertStatus'];

// Store the latest property values
const latestValues = {};
let arduinoClient = null;

// Initialize Arduino IoT Cloud connection
async function connectToArduinoCloud() {
  try {
    console.log('Backend Connecting to Arduino IoT Cloud...');
    arduinoClient = await ArduinoIoTCloud.connect({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      onDisconnect: (message) => {
        console.error('Disconnected from Arduino IoT Cloud:', message);
        // Try to reconnect after a delay
        setTimeout(connectToArduinoCloud, 5000);
      }
    });
    
    console.log('Connected to Arduino IoT Cloud');
    
    // Subscribe to all properties
    SENSOR_PROPERTIES.forEach(property => {
      arduinoClient.onPropertyValue(THING_ID, property, (value) => {
        console.log(`Received ${property} update:`, value);
        latestValues[property] = value;
        
        // Emit the update to all connected clients
        io.emit('property-update', { property, value });
      });
    });
    
    return true;
  } catch (error) {
    console.error('Failed to connect to Arduino IoT Cloud:', error);
    return false;
  }
}

// REST API endpoint to get all property values
app.get('/api/properties', (req, res) => {
  if (!arduinoClient) {
    return res.status(503).json({ error: 'Not connected to Arduino IoT Cloud' });
  }
  
  res.json(latestValues);
});

// REST API endpoint to get a specific property value
app.get('/api/properties/:property', (req, res) => {
  const property = req.params.property;
  
  if (!arduinoClient) {
    return res.status(503).json({ error: 'Not connected to Arduino IoT Cloud' });
  }
  
  if (!SENSOR_PROPERTIES.includes(property)) {
    return res.status(404).json({ error: 'Property not found' });
  }
  
  res.json({ [property]: latestValues[property] });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send all current values immediately on connection
  socket.emit('all-properties', latestValues);
  
  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectToArduinoCloud();
});