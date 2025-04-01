import React, { useState } from 'react';

const ControlPage: React.FC = () => {
  const [inflationLevel, setInflationLevel] = useState(0);
  const [isInflating, setIsInflating] = useState(false);
  const [isDeflating, setIsDeflating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready');

  const maxInflation = 100;
  const minInflation = 0;
  const inflationStep = 5;

  const handleInflate = () => {
    if (inflationLevel < maxInflation) {
      setIsInflating(true);
      setIsDeflating(false);
      setStatusMessage('Inflating...');
      
      // Simulate inflation process
      setTimeout(() => {
        setInflationLevel(prev => Math.min(prev + inflationStep, maxInflation));
        setIsInflating(false);
        setStatusMessage(inflationLevel + inflationStep >= maxInflation ? 'Fully inflated' : 'Ready');
      }, 1000);
    } else {
      setStatusMessage('Maximum inflation reached');
    }
  };

  const handleDeflate = () => {
    if (inflationLevel > minInflation) {
      setIsDeflating(true);
      setIsInflating(false);
      setStatusMessage('Deflating...');
      
      // Simulate deflation process
      setTimeout(() => {
        setInflationLevel(prev => Math.max(prev - inflationStep, minInflation));
        setIsDeflating(false);
        setStatusMessage(inflationLevel - inflationStep <= minInflation ? 'Fully deflated' : 'Ready');
      }, 1000);
    } else {
      setStatusMessage('Fully deflated');
    }
  };

  const handleStop = () => {
    setIsInflating(false);
    setIsDeflating(false);
    setStatusMessage('Stopped');
  };

  const handlePreset = (level: number) => {
    setIsInflating(false);
    setIsDeflating(false);
    setInflationLevel(level);
    setStatusMessage(`Set to ${level}% inflation`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-100 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Inflatacare</h1>
          </div>
          <a href="/" className="text-blue-700 hover:text-blue-900 text-lg font-medium">
            Home
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-8">
            Product Control Panel
          </h1>
          
          {/* Current Status */}
          <div className="bg-blue-50 rounded-lg p-6 shadow-md mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-4 text-center">Current Status</h2>
            
            {/* Status Message */}
            <div className="text-center mb-6">
              <p className="text-xl text-blue-700 font-medium">{statusMessage}</p>
            </div>
            
            {/* Inflation Level Indicator */}
            <div className="mb-4">
              <div className="flex justify-between text-blue-700 mb-2">
                <span>Empty</span>
                <span>{inflationLevel}%</span>
                <span>Full</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-8 md:h-10">
                <div 
                  className="bg-blue-600 h-8 md:h-10 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${inflationLevel}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="bg-white rounded-lg p-6 shadow-md mb-8 border border-blue-100">
            <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-6 text-center">Controls</h2>
            
            {/* Main Control Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <button 
                onClick={handleInflate}
                disabled={isInflating || inflationLevel >= maxInflation}
                className={`py-6 px-4 rounded-lg text-xl font-bold text-white shadow-md transition flex flex-col items-center justify-center
                  ${(isInflating || inflationLevel >= maxInflation) 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Inflate
              </button>
              
              <button 
                onClick={handleStop}
                disabled={!isInflating && !isDeflating}
                className={`py-6 px-4 rounded-lg text-xl font-bold text-white shadow-md transition flex flex-col items-center justify-center
                  ${(!isInflating && !isDeflating) 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 active:bg-red-800'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Stop
              </button>
              
              <button 
                onClick={handleDeflate}
                disabled={isDeflating || inflationLevel <= minInflation}
                className={`py-6 px-4 rounded-lg text-xl font-bold text-white shadow-md transition flex flex-col items-center justify-center
                  ${(isDeflating || inflationLevel <= minInflation) 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Deflate
              </button>
            </div>
            
            {/* Preset Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3 text-center">Quick Settings</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button 
                  onClick={() => handlePreset(0)}
                  className="py-4 px-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium rounded-lg shadow-sm transition"
                >
                  Empty
                </button>
                <button 
                  onClick={() => handlePreset(25)}
                  className="py-4 px-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium rounded-lg shadow-sm transition"
                >
                  Soft (25%)
                </button>
                <button 
                  onClick={() => handlePreset(75)}
                  className="py-4 px-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium rounded-lg shadow-sm transition"
                >
                  Firm (75%)
                </button>
                <button 
                  onClick={() => handlePreset(100)}
                  className="py-4 px-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium rounded-lg shadow-sm transition"
                >
                  Maximum
                </button>
              </div>
            </div>
          </div>
          
          {/* Help Section */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-800 mb-4">How to Use</h2>
            <ul className="space-y-3 text-blue-700">
              <li className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Press <strong>Inflate</strong> to add air to your product</span>
              </li>
              <li className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Press <strong>Deflate</strong> to remove air from your product</span>
              </li>
              <li className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Press <strong>Stop</strong> at any time to halt inflation or deflation</span>
              </li>
              <li className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Use <strong>Quick Settings</strong> buttons to quickly set to common firmness levels</span>
              </li>
            </ul>
            
            <div className="mt-6 text-center">
              <p className="text-blue-700">Need assistance? Call our support team:</p>
              <p className="text-xl font-bold text-blue-800 mt-1">(555) 123-4567</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-blue-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-200">© {new Date().getFullYear()} Inflatacare. All rights reserved.</p>
          <p className="text-blue-300 mt-2">For assistance, call (555) 123-4567</p>
        </div>
      </footer>
    </div>
  );
};

export default ControlPage;