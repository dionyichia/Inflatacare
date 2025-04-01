import React, { useState, useEffect } from 'react';
import humanOutlineImage from '../components/human_outline.png';

const PressureMonitorDashboard = () => {
  // State for pressure points
  const [pressurePoints, setPressurePoints] = useState([
    { id: 'left-elbow', name: 'Left Elbow', value: 0, x: 190, y: 60 },
    { id: 'right-elbow', name: 'Right Elbow', value: 0, x: 310, y: 60},
    { id: 'left-shoulder', name: 'Left Shoulder', value: 0, x: 200, y: -10},
    { id: 'right-shoulder', name: 'Right Shoulder', value: 0, x: 300, y: -10 },
    { id: 'left-lower-back', name: 'Left Lower Back', value: 0, x: 225, y: 110 },
    { id: 'right-lower-back', name: 'Right Lower Back', value: 0, x: 275, y: 110 },
  ]);

  // State for tracking sensor with longest pressure duration
  const [longestDuration, setLongestDuration] = useState({
    sensorName: 'None',
    time: '00:00:00',
  });

  // Monitor mode state
  const [mode, setMode] = useState('Sitting up');

  // Placeholder for Arduino API connection
  useEffect(() => {
    // Simulate Arduino sensor data
    const intervalId = setInterval(() => {
      // This would be replaced with actual API calls to your Arduino
      const simulatedData = pressurePoints.map(point => {
        // Random pressure value between 0 and 100
        const newValue = Math.random() > 0.7 ? Math.floor(Math.random() * 100) : 0;
        return { ...point, value: newValue };
      });
      
      setPressurePoints(simulatedData);
      
      // Update longest duration if any sensor is above threshold
      const activePoints = simulatedData.filter(point => point.value > 30);
      if (activePoints.length > 0) {
        // Get a random active point for simulation
        const highPressurePoint = activePoints[Math.floor(Math.random() * activePoints.length)];
        
        // Generate a random duration for demonstration
        const hours = String(Math.floor(Math.random() * 3)).padStart(2, '0');
        const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        
        setLongestDuration({
          sensorName: highPressurePoint.name,
          time: `${hours}:${minutes}:${seconds}`,
        });
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  // Calculate size and color based on pressure value
  const getPointStyle = (value) => {
    const baseSize = 10;
    const maxSize = 25;
    const size = value > 0 ? baseSize + (value / 100) * (maxSize - baseSize) : baseSize;
    const color = value > 30 ? 'red' : 'green';
    
    return {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
    };
  };

  return (
    
    <div className="relative w-full h-screen bg-gray-100 flex flex-col items-center p-4 overflow-hidden">
    {/* App Title */}
    <h1 className="text-4xl font-bold text-blue-800 text-center">
      Inflatacare
    </h1>
    {/* Top Section: Two Boxes */}
    <div className="flex justify-between mb-4">
      {/* Time display box - top left */}
      <div className="bg-white p-4 rounded-lg shadow-md flex-1 max-w-xs text-center min-h-[80px]">
        <h2 className="text-lg font-bold">High Pressure Timer</h2>
        <p className="text-3xl font-mono">{longestDuration.time}</p>
        <p className="text-sm text-gray-600">{longestDuration.sensorName}</p>
      </div>

      {/* Mode display box - top right */}
      <div className="bg-white p-4 rounded-lg shadow-md flex-1 max-w-xs min-h-[80px] flex flex-col justify-center items-center">
        <h2 className="text-lg font-bold">Mode:</h2>
        <p className="text-2xl">{mode}</p>
      </div>
    </div>
      
      {/* Human Outline Section */}
    <div className="flex items-center justify-center flex-1">
      <div className="relative">
        {/* Human Outline Image */}
        <img
          src={humanOutlineImage}
          alt="Human Body Outline"
          className="w-[500px] h-auto max-w-full -mt-30"
        />
          
          {/* Pressure Points - Rendered separately for dynamic styling */}
          {pressurePoints.map((point) => (
            <div
              key={point.id}
              className="absolute rounded-full transition-all duration-300"
              style={{
                left: `${point.x}px`,
                top: `${point.y}px`,
                transform: 'translate(-50%, -50%)',
                ...getPointStyle(point.value),
              }}
              title={`${point.name}: ${point.value}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PressureMonitorDashboard;