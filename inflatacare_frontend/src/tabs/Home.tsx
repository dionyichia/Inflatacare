import { useState, useEffect } from 'react';
import humanOutlineImage from '../components/human_outline.png';
import { useArduinoApi, useSensorProperty } from '../api';
import { Link, useLocation } from "react-router-dom";
import { Home, Sliders } from "lucide-react";
import BottomNavBar from '../components/Navbar';

const PressureMonitorDashboard = () => {
  // Use the Arduino API hooks to get sensor data
  const { isConnected } = useArduinoApi();
  const fRS1 = useSensorProperty('fRS1'); // Left Elbow
  const fRS2 = useSensorProperty('fRS2'); // Right Elbow
  const fRS3 = useSensorProperty('fRS3'); // Left Shoulder
  const fRS4 = useSensorProperty('fRS4'); // Right Shoulder
  const fRS5 = useSensorProperty('fRS5'); // Left Lower Back
  const fRS6 = useSensorProperty('fRS6'); // Right Lower Back
  const highestAccTime = useSensorProperty('highestAccTime');
  const alertStatus = useSensorProperty('alertStatus');

  // State for viewport
  const [isMobile, setIsMobile] = useState(false);
  
  // Check viewport size on mount and resize
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint in Tailwind
    };
    
    // Initial check
    checkViewport();
    
    // Listen for resize events
    window.addEventListener('resize', checkViewport);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Pressure sensor mapping with responsive positioning
  const sensorMapping = [
    { id: 'left-elbow', name: 'Left Elbow', bitPosition: 0, 
      desktop: { x: 195, y: -60 }, mobile: { x: 59, y: 37 } },
    { id: 'right-elbow', name: 'Right Elbow', bitPosition: 1, 
      desktop: { x: 305, y: -60 }, mobile: { x: 41, y: 37 } },
    { id: 'left-shoulder', name: 'Left Shoulder', bitPosition: 2, 
      desktop: { x: 210, y: -105 }, mobile: { x: 56, y: 22 } },
    { id: 'right-shoulder', name: 'Right Shoulder', bitPosition: 3, 
      desktop: { x: 290, y: -105 }, mobile: { x: 44, y: 22 } },
    { id: 'left-lower-back', name: 'Left Lower Back', bitPosition: 4, 
      desktop: { x: 230, y: -30 }, mobile: { x: 53, y: 45 } },
    { id: 'right-lower-back', name: 'Right Lower Back', bitPosition: 5, 
      desktop: { x: 270, y: -30 }, mobile: { x: 47, y: 45 } },
  ];

  // State for pressure points
  const [pressurePoints, setPressurePoints] = useState(
    sensorMapping.map(point => ({ ...point, value: 0, isAlert: false }))
  );

  // State for tracking sensor with longest pressure duration
  const [longestDuration, setLongestDuration] = useState({
    sensorName: 'None',
    time: '00:00:00',
  });

  // Patient position state
  const [patientPosition, setPatientPosition] = useState('Sitting up');

  // Update pressure points when sensor data changes
  useEffect(() => {
    const sensorValues = [fRS1, fRS2, fRS3, fRS4, fRS5, fRS6];
    
    // Check if we have valid sensor values
    if (sensorValues.some(value => value !== undefined)) {
      const alertBits = alertStatus !== undefined ? alertStatus : 0;
      
      // Update the pressure points with sensor values and alert status
      const updatedPoints = pressurePoints.map((point, index) => {
        // Get the current sensor value, default to previous value if undefined
        const value = sensorValues[index] !== undefined 
          ? sensorValues[index] 
          : point.value;
        
        // Check if this sensor's bit is set in alertStatus
        const isAlert = ((alertBits >> point.bitPosition) & 1) === 1;
        
        return { ...point, value, isAlert };
      });
      
      setPressurePoints(updatedPoints);
    }
  }, [fRS1, fRS2, fRS3, fRS4, fRS5, fRS6, alertStatus]);

  // Update longest duration when highestAccTime changes
  useEffect(() => {
    console.log("changing highestAccTime: ", highestAccTime)

    if (highestAccTime === 0) {
      setLongestDuration({
        sensorName: "",
        time: highestAccTime
      });
    }
    else if (highestAccTime) {
      // Find the sensor with highest pressure to associate with the time
      const highestPressureSensor = pressurePoints.reduce(
        (highest, current) => current.value > highest.value ? current : highest,
        pressurePoints[0]
      );

      setLongestDuration({
        sensorName: highestPressureSensor.name,
        time: highestAccTime
      });
    }
  }, [highestAccTime, pressurePoints, alertStatus]);

  // Calculate size and color based on pressure value and alert status
  const getPointStyle = (value: any, isAlert: any) => {
    const baseSize = isMobile ? 8 : 10; // Slightly smaller on mobile
    const mamize = isMobile ? 20 : 25; // Slightly smaller on mobile
    const size = value > 0 ? baseSize + (value / 100) * (mamize - baseSize) : baseSize;
    
    // Use alert status to determine color instead of threshold
    const color = isAlert ? 'red' : value > 0 ? '#4299e1' : '#9CA3AF';
    
    return {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      bomhadow: isAlert ? '0 0 12px rgba(239, 68, 68, 0.7)' : value > 70 ? '0 0 8px rgba(66, 153, 225, 0.5)' : 'none',
    };
  };

  return (
    <>
      <div className="relative flex flex-col h-screen bg-gray-50 text-gray-800">
        {/* Header Bar */}
        <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-3 shadow-md flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Inflatacare<span className="text-blue-300">Monitor</span>
          </h1>
          
          {/* Connection Status */}
          <div className={`px-3 py-1 rounded-full text-base md:text-sm font-medium flex items-center ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-200 animate-pulse' : 'bg-red-200'}`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </header>
    
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col flex-1">
          {/* Top Status Bar - Position and Timer */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex justify-between items-center px-3 py-2">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-base font-medium text-gray-600">Active Session</span>
              </div>
              <span className="text-base text-gray-500">
                Updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              <div className="p-3">
                <h3 className="text-base uppercase tracking-wider text-gray-500 font-medium">Patient Position</h3>
                <p className="text-lg font-medium mt-1 text-gray-800">{patientPosition}</p>
              </div>
              <div className="p-3">
                <h3 className="text-base uppercase tracking-wider text-gray-500 font-medium">High Pressure Timer</h3>
                <p className="text-2xl font-mono font-medium mt-1 text-gray-800">{longestDuration.time || "00:00:00"}</p>
                {longestDuration.sensorName && (
                  <p className="text-base text-gray-500 mt-1">{longestDuration.sensorName}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Human Diagram - Adjusted to better fill space */}
          <div className="flex-1 flex items-center justify-center p-2 relative">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={humanOutlineImage}
                alt="Human Body Outline"
                className="max-w-full max-h-[45vh] w-auto h-auto object-contain"
              />
              
              {/* Pressure Points */}
              {pressurePoints.map((point) => (
                <div
                  key={point.id}
                  className="absolute rounded-full transition-all duration-300 flex items-center justify-center"
                  style={{
                    left: `${point.mobile.x}%`,
                    top: `${point.mobile.y}%`,
                    transform: 'translate(-50%, -50%)',
                    ...getPointStyle(point.value, point.isAlert),
                  }}
                >
                  {point.isAlert && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-30"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Bottom Pressure Points Grid - Adjusted padding */}
          <div className="bg-white border-t border-gray-200 shadow-inner px-3 py-2"> {/* Added mb-16 to create space for navbar */}
            <h3 className="text-base uppercase tracking-wider text-gray-500 font-medium mb-2">
              Pressure Points Data
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {pressurePoints.map((point) => (
                <div 
                  key={point.id} 
                  className={`p-2 rounded-lg border ${
                    point.isAlert 
                      ? 'border-red-200 bg-red-50' 
                      : point.value > 50 
                        ? 'border-blue-200 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    <div 
                      className="w-2 h-2 rounded-full mr-1.5" 
                      style={{ backgroundColor: point.isAlert ? 'red' : point.value > 0 ? '#4299e1' : '#9CA3AF' }}
                    ></div>
                    <span className="text-base font-medium text-gray-700 truncate">{point.name}</span>
                  </div>
                  <div className={`text-center font-mono text-xl font-medium ${point.isAlert ? 'text-red-600' : 'text-gray-800'}`}>
                    {point.value.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    
        {/* Desktop Layout - Adjusted for better spacing */}
        <div className="hidden md:flex md:flex-row flex-1 w-full max-w-screen-xl mx-auto">
          {/* Left Side - Human Diagram */}
          <div className="flex-1 flex items-center justify-center p-4 relative">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={humanOutlineImage}
                  alt="Human Body Outline"
                  className="max-w-full max-h-[75vh] w-auto h-auto object-contain"
                />
                
                {pressurePoints.map((point) => (
                  <div
                    key={point.id}
                    className="absolute rounded-full transition-all duration-300 flex items-center justify-center"
                    style={{
                      left: `${point.desktop.x / 5}%`,
                      top: `${point.desktop.y / 5 + 50}%`,
                      transform: 'translate(-50%, -50%)',
                      ...getPointStyle(point.value, point.isAlert),
                    }}
                  >
                    {point.isAlert && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-30"></span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Side - Info Panel */}
          <div className="w-full md:w-80 lg:w-96 bg-white md:border-l border-gray-200 shadow-inner flex flex-col">
            {/* Patient Info Section */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700">Patient Monitoring</h2>
              <div className="flex items-center mt-2">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <p className="text-base font-medium text-gray-600">Active Session</p>
              </div>
            </div>
            
            {/* Position Info */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-base uppercase tracking-wider text-gray-500 font-medium">Position</h3>
              <p className="text-lg font-medium mt-1">{patientPosition}</p>
            </div>
            
            {/* Timer Info */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-base uppercase tracking-wider text-gray-500 font-medium">High Pressure Timer</h3>
              <div className="mt-2">
                <p className="text-3xl font-mono">{longestDuration.time || "00:00:00"}</p>
                <p className="text-base text-gray-600 mt-1">{longestDuration.sensorName}</p>
              </div>
            </div>
            
            {/* Pressure Points Summary */}
            <div className="p-4 flex-grow overflow-auto">
              <h3 className="text-base uppercase tracking-wider text-gray-500 font-medium mb-3">Pressure Points</h3>
              <div className="space-y-3">
                {pressurePoints.map((point) => (
                  <div key={point.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: point.isAlert ? 'red' : point.value > 0 ? '#4299e1' : '#9CA3AF' }}
                      ></div>
                      <span className="text-base">{point.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-xl font-medium ${point.isAlert ? 'text-red-600' : ''}`}>
                        {point.value.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer with timestamp */}
            <div className="p-3 text-base text-gray-500 text-center border-t border-gray-200">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        {/* Navigation Bar - Fixed position, adjusted styling */}
        <BottomNavBar/>
      </div>
    </>
  );
};

export default PressureMonitorDashboard;