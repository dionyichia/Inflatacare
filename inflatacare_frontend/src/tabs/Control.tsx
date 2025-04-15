import { useState, useEffect } from 'react';
import { useArduinoApi } from '../api';
import BottomNavBar from '../components/Navbar';

const ControlPage = () => {
  const [selectedSection, setSelectedSection] = useState(null); // T, L, or R
  const [selectedMode, setSelectedMode] = useState(0); // 0, 1, 2, 3, 4
    const { isConnected } = useArduinoApi();

  // When a section is selected, set default mode to 2
  useEffect(() => {
    if (selectedSection) {
      setSelectedMode(2);
    }
  }, [selectedSection]);

  // Handle section selection
  const handleSectionClick = (section: any) => {
    if (selectedSection === section) {
      // If the same section is clicked again, deselect it
      setSelectedSection(null);
      setSelectedMode(0);
      return;
    }
    setSelectedSection(section);
  };

  // Handle mode selection
  const handleModeClick = (mode: any) => {
    if (mode === 0) {
      // If mode 0 is selected, deselect the section
      setSelectedSection(null);
    }
    setSelectedMode(mode);
  };

  return (
    <div className="relative flex flex-col h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Header Bar */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Inflatacare<span className="text-blue-300">Control</span>
        </h1>
        
        {/* Connection Status */}
        <div className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-200 animate-pulse' : 'bg-red-200'}`}></div>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 overflow-auto">
        {/* Instruction Panel */}
        <div className={`mb-4 p-4 rounded-lg bg-white shadow-md border-l-4 transition-all duration-300 ${selectedSection ? 'border-green-500' : 'border-blue-500'}`}>
          <p className="text-lg md:text-xl font-medium">
            {selectedSection 
              ? `Inflating ${selectedSection} to level ${selectedMode}`
              : "Select a section below to activate controls"}
          </p>
        </div>
        
        {/* Sections Grid - Takes most of the available space */}
        <div className="flex-grow flex flex-col mb-6 shadow-lg rounded-lg overflow-hidden border border-gray-200">
          {/* Top Row */}
          <div 
            onClick={() => handleSectionClick('T')}
            className={`
              flex-none h-24 md:h-32 flex items-center justify-center
              ${selectedSection === 'T' ? 'bg-green-500 text-white' : 'bg-white text-gray-800'}
              hover:bg-opacity-90 border-b border-gray-200 cursor-pointer transition-all duration-200
              ${selectedSection === 'T' ? 'shadow-inner' : 'hover:shadow-md'}
            `}
          >
            <div className="text-3xl md:text-5xl font-bold">T</div>
          </div>
          
          {/* Bottom Row (L and R) */}
          <div className="flex-grow flex">
            <div 
              onClick={() => handleSectionClick('L')}
              className={`
                flex-1 flex items-center justify-center
                ${selectedSection === 'L' ? 'bg-green-500 text-white' : 'bg-white text-gray-800'}
                hover:bg-opacity-90 border-r border-gray-200 cursor-pointer transition-all duration-200
                ${selectedSection === 'L' ? 'shadow-inner' : 'hover:shadow-md'}
              `}
            >
              <div className="text-3xl md:text-5xl font-bold">L</div>
            </div>
            <div 
              onClick={() => handleSectionClick('R')}
              className={`
                flex-1 flex items-center justify-center
                ${selectedSection === 'R' ? 'bg-green-500 text-white' : 'bg-white text-gray-800'}
                hover:bg-opacity-90 cursor-pointer transition-all duration-200
                ${selectedSection === 'R' ? 'shadow-inner' : 'hover:shadow-md'}
              `}
            >
              <div className="text-3xl md:text-5xl font-bold">R</div>
            </div>
          </div>
        </div>
        
        {/* Mode Controls - Fixed height */}
        <div className={`
          p-4 md:p-6 rounded-lg shadow-md transition-all duration-300
          ${!selectedSection ? 'bg-gray-200 opacity-70' : 'bg-white'}
        `}>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center text-gray-700">
            Inflation Mode
          </h2>
          
          <div className="flex justify-center items-center space-x-3 md:space-x-6">
            {[0, 1, 2, 3, 4].map((mode) => (
              <button
                key={mode}
                onClick={() => selectedSection && handleModeClick(mode)}
                disabled={!selectedSection}
                className={`
                  w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center
                  text-xl md:text-2xl lg:text-3xl font-bold transition-all duration-200
                  ${!selectedSection 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : selectedMode === mode 
                      ? 'bg-blue-100 text-gray-300 border-4 border-blue-600 shadow-md' 
                      : 'bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }
                `}
              >
                {mode}
              </button>
            ))}
          </div>
          
          <p className="text-center mt-4 text-sm md:text-base text-gray-600">
            {selectedSection 
              ? "Level 0 will deactivate the section" 
              : "Select a section above to enable controls"}
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 p-2 text-xs text-center text-gray-500">
        Inflatacare System &copy; {new Date().getFullYear()}
      </footer>

      <BottomNavBar/>
    </div>
  );
};

export default ControlPage;