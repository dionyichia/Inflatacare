import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

// Define types for the Arduino IoT properties
type SensorProperty = 'fRS1' | 'fRS2' | 'fRS3' | 'fRS4' | 'fRS5' | 'fRS6' | 'highestAccTime' | 'alertStatus';

interface SensorData {
  [key: string]: any; // Generic type for various sensor values
}

// Define API context interface
interface ArduinoApiContextType {
  isConnected: boolean;
  sensorData: SensorData;
  error: string | null;
  getProperty: (property: SensorProperty) => any;
  subscribeToProperty: (property: SensorProperty, callback: (value: any) => void) => () => void;
}

// Create context with default values
const ArduinoApiContext = createContext<ArduinoApiContextType>({
  isConnected: false,
  sensorData: {},
  error: null,
  getProperty: () => null,
  subscribeToProperty: () => () => {}
});

// Server URL (from environment variable or default)
const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Provider component
interface ApiProviderProps {
  children: ReactNode;
}

export const ArduinoApiProvider = ({ children }: ApiProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>({});
  const [error, setError] = useState<string | null>(null);
  const [propertySubscriptions, setPropertySubscriptions] = useState<Map<string, Set<(value: any) => void>>>(
    new Map()
  );

  // Initialize WebSocket connection
  useEffect(() => {
    const socketInstance = io(SERVER_URL);
    
    // Connection events
    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      setError(null);
    });
    
    socketInstance.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });
    
    socketInstance.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError(`Connection error: ${err.message}`);
      setIsConnected(false);
    });

    // Receive all properties at once
    socketInstance.on('all-properties', (data: SensorData) => {
      console.log('Received all properties:', data);
      setSensorData(data);
      
      // Notify subscribers
      Object.entries(data).forEach(([property, value]) => {
        const subscribers = propertySubscriptions.get(property);
        if (subscribers) {
          subscribers.forEach(callback => callback(value));
        }
      });
    });
    
    // Receive individual property updates
    socketInstance.on('property-update', ({ property, value }: { property: string; value: any }) => {
      console.log(`Property update - ${property}:`, value);
      
      setSensorData(prev => ({
        ...prev,
        [property]: value
      }));
      
      // Notify subscribers
      const subscribers = propertySubscriptions.get(property);
      if (subscribers) {
        subscribers.forEach(callback => callback(value));
      }
    });
    
    setSocket(socketInstance);
    
    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Update property subscriptions when they change
  useEffect(() => {
    // The effect relies on propertySubscriptions ref, but we don't want to re-initialize
    // the socket when subscriptions change, so intentionally leave the dependency array empty.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to get current value of a property
  const getProperty = (property: SensorProperty) => {
    return sensorData[property];
  };
  
  // Function to subscribe to property changes
  const subscribeToProperty = (property: SensorProperty, callback: (value: any) => void) => {
    // Add to subscription map
    if (!propertySubscriptions.has(property)) {
      propertySubscriptions.set(property, new Set());
    }
    propertySubscriptions.get(property)?.add(callback);
    
    // Initial callback with current value if available
    if (sensorData[property] !== undefined) {
      callback(sensorData[property]);
    }
    
    // Return unsubscribe function
    return () => {
      const subscribers = propertySubscriptions.get(property);
      if (subscribers) {
        subscribers.delete(callback);
        // Clean up empty subscription sets
        if (subscribers.size === 0) {
          propertySubscriptions.delete(property);
        }
      }
    };
  };
  
  const value = {
    isConnected,
    sensorData,
    error,
    getProperty,
    subscribeToProperty
  };
  
  return (
    <ArduinoApiContext.Provider value={value}>
      {children}
    </ArduinoApiContext.Provider>
  );
};

// Custom hook to use the API
export const useArduinoApi = () => useContext(ArduinoApiContext);

// Specialized hook for specific properties
export const useSensorProperty = (property: SensorProperty) => {
  const { sensorData, subscribeToProperty } = useArduinoApi();
  const [value, setValue] = useState<any>(sensorData[property]);
  
  useEffect(() => {
    // Initial value
    setValue(sensorData[property]);
    
    // Subscribe to changes
    const unsubscribe = subscribeToProperty(property, setValue);
    
    return unsubscribe;
  }, [property, sensorData, subscribeToProperty]);
  
  return value;
};