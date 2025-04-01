// ArduinoDevices.tsx
import React, { useState, useEffect } from 'react';
import arduinoApi from '../api'; // Import the API client

interface Device {
  id: string;
  name: string;
  // Add other device properties as needed
}

interface DeviceVariable {
  id: string;
  name: string;
  value: any;
  // Add other variable properties as needed
}

const ArduinoDevices: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [variables, setVariables] = useState<DeviceVariable[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch devices on component mount
  useEffect(() => {
    async function fetchDevices() {
      try {
        setLoading(true);
        const deviceList = await arduinoApi.getDevices();
        setDevices(deviceList);
        setError(null);
      } catch (err) {
        setError('Failed to fetch devices. Please check your connection and credentials.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDevices();
  }, []);

  // Fetch variables when a device is selected
  useEffect(() => {
    async function fetchVariables() {
      if (!selectedDevice) return;
      
      try {
        setLoading(true);
        const variableList = await arduinoApi.getDeviceVariables(selectedDevice);
        setVariables(variableList);
        setError(null);
      } catch (err) {
        setError(`Failed to fetch variables for device ${selectedDevice}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchVariables();
  }, [selectedDevice]);

  // Handle device selection
  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
  };

  if (loading && devices.length === 0) {
    return <div>Loading devices...</div>;
  }

  if (error && devices.length === 0) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="arduino-devices">
      <h2>Arduino IoT Devices</h2>
      
      <div className="device-list">
        <h3>Your Devices</h3>
        {devices.length === 0 ? (
          <p>No devices found</p>
        ) : (
          <ul>
            {devices.map(device => (
              <li 
                key={device.id} 
                className={selectedDevice === device.id ? 'selected' : ''}
                onClick={() => handleDeviceSelect(device.id)}
              >
                {device.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedDevice && (
        <div className="variables-list">
          <h3>Device Variables</h3>
          {loading ? (
            <p>Loading variables...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : variables.length === 0 ? (
            <p>No variables found for this device</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {variables.map(variable => (
                  <tr key={variable.id}>
                    <td>{variable.name}</td>
                    <td>{JSON.stringify(variable.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ArduinoDevices;