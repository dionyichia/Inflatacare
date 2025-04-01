import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ControlPage = () => {
  const [selectedSection, setSelectedSection] = useState(null); // T, L, or R
  const [selectedMode, setSelectedMode] = useState(0); // 0, 1, 2, 3, 4

  // When a section is selected, set default mode to 2
  useEffect(() => {
    if (selectedSection) {
      setSelectedMode(2);
    }
  }, [selectedSection]);

  // Handle section selection
  const handleSectionClick = (section) => {
    if (selectedSection === section) {
      // If the same section is clicked again, deselect it
      setSelectedSection(null);
      setSelectedMode(0);
      return;
    }
    setSelectedSection(section);
  };

  // Handle mode selection
  const handleModeClick = (mode) => {
    if (mode === 0) {
      // If mode 0 is selected, deselect the section
      setSelectedSection(null);
    }
    setSelectedMode(mode);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-8 pb-24 flex-grow flex flex-col">
        <div className="w-full mx-auto flex-grow flex flex-col">
          <h1 className="text-4xl font-bold text-blue-800 text-center mb-8">
            Inflatacare
          </h1>
          
          {/* Description message above top section */}
          {!selectedSection && (
            <div className="text-center mb-6 text-3xl font-bold text-black-800">
              Select a section below to activate controls
            </div>
          )}
          
          {/* Top Section - Mode Control - Made wider but shorter */}
          <div className={`mb-8 p-6 rounded-lg border-4 ${selectedSection ? 'bg-white border-black-300' : 'bg-gray-300 border-gray-400 opacity-70'}`}>
            <h2 className={`text-3xl font-bold text-center mb-6 ${selectedSection ? 'text-black-800' : 'text-gray-500'}`}>
              Inflation Modes
            </h2>
            
            <div className="flex justify-center items-center space-x-8">
              {[0, 1, 2, 3, 4].map((mode) => (
                <div
                  key={mode}
                  onClick={() => selectedSection && handleModeClick(mode)}
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: !selectedSection ? '#9ca3af' : 'white',
                    color: selectedMode === mode && selectedSection ? '#dc2626' : !selectedSection ? '#4b5563' : 'black',
                    border: selectedMode === mode && selectedSection ? '6px solid #dc2626' : '2px solid #d1d5db',
                    opacity: !selectedSection ? '0.7' : '1',
                    cursor: !selectedSection ? 'not-allowed' : 'pointer',
                    boxSizing: 'border-box',
                    outline: 'none',
                    position: 'relative',
                    boxShadow: 'none'
                  }}
                >
                  {mode}
                </div>
              ))}
            </div>
            
            <div className={`text-center mt-4 text-2xl ${selectedSection ? 'text-black-600' : 'text-gray-500'}`}>
              {selectedSection ? (
                <>Controlling <span className="font-bold">{selectedSection}</span> section at level <span className="font-bold">{selectedMode}</span></>
              ) : "Controls inactive"}
            </div>
          </div>
          
          {/* Middle Section - Section Selection Table - Larger height */}
          <div className="mb-8 flex-grow">
            <div className="border-4 border-blue-800 rounded-lg overflow-hidden h-full">
              {/* Row 1 - T section */}
              <div 
                onClick={() => handleSectionClick('T')}
                className={`
                  py-12 text-center text-4xl font-bold border-b-4 border-blue-800
                  ${selectedSection === 'T' ? 'bg-green-500 text-white' : 'bg-white text-black'}
                  cursor-pointer transition-colors duration-200
                `}
              >
                T
              </div>
              
              {/* Row 2 - L and R sections */}
              <div className="flex h-full">
                <div 
                  onClick={() => handleSectionClick('L')}
                  className={`
                    py-30 text-center text-4xl font-bold w-1/2 border-r-4 border-blue-800
                    ${selectedSection === 'L' ? 'bg-green-500 text-white' : 'bg-white text-black'}
                    cursor-pointer transition-colors duration-200
                  `}
                >
                  L
                </div>
                <div 
                  onClick={() => handleSectionClick('R')}
                  className={`
                    py-30 text-center text-4xl font-bold w-1/2
                    ${selectedSection === 'R' ? 'bg-green-500 text-white' : 'bg-white text-black'}
                    cursor-pointer transition-colors duration-200
                  `}
                >
                  R
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ControlPage;