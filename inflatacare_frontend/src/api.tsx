// api.tsx
import ArduinoIotClient from '@arduino/arduino-iot-client';
import rp from 'request-promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Function to get access token
async function getToken() {
  const options = {
    method: 'POST',
    url: 'https://api2.arduino.cc/iot/v1/clients/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    json: true,
    form: {
      grant_type: 'client_credentials',
      client_id: process.env.ARDUINO_CLIENT_ID || 'It1AO9cdd0dg5cT0PspuoFNl8nXcGxoX',
      client_secret: process.env.ARDUINO_CLIENT_SECRET || 'WKSBoP6gshGpcqnGNl8RSIHO2K642vWU3H7ROZKojcsg4VY8xPrxKdrhwtDd0BmI',
      audience: 'https://api2.arduino.cc/iot'
      // If required, add organization_id: '<org_id>' here
    }
  };

  try {
    const response = await rp(options);
    return response['access_token'];
  } catch (error) {
    console.error("Failed getting an access token:", error);
    throw error;
  }
}

// Initialize the API client
async function initializeClient() {
  const client = ArduinoIotClient.ApiClient.instance;
  // Configure OAuth2 access token for authorization
  const oauth2 = client.authentications['oauth2'];
  oauth2.accessToken = await getToken();
  
  return client;
}

// Create API instances
export async function createDevicesApi() {
  const client = await initializeClient();
  return new ArduinoIotClient.DevicesV2Api(client);
}

// Function to get all devices
export async function getDevices(organizationId = null) {
  const api = await createDevicesApi();
  const opts = organizationId ? { 'xOrganization': organizationId } : {};
  
  try {
    return await api.devicesV2List(opts);
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
}

// Function to get a specific device
export async function getDevice(deviceId, organizationId = null) {
  const api = await createDevicesApi();
  const opts = organizationId ? { 'xOrganization': organizationId } : {};
  
  try {
    return await api.devicesV2Show(deviceId, opts);
  } catch (error) {
    console.error(`Error fetching device ${deviceId}:`, error);
    throw error;
  }
}

// Function to get device variables
export async function getDeviceVariables(deviceId, organizationId = null) {
  const client = await initializeClient();
  const api = new ArduinoIotClient.PropertiesV2Api(client);
  const opts = organizationId ? { 'xOrganization': organizationId } : {};
  
  try {
    return await api.propertiesV2List(deviceId, opts);
  } catch (error) {
    console.error(`Error fetching variables for device ${deviceId}:`, error);
    throw error;
  }
}

// You can add more functions as needed for your specific use cases

export default {
  getDevices,
  getDevice,
  getDeviceVariables,
  createDevicesApi
};