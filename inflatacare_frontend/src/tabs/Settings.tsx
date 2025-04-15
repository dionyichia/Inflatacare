import { useState, useEffect } from 'react';
import { useArduinoApi } from '../api';
import { Sliders, Save, RotateCcw } from 'lucide-react';
import BottomNavBar from '../components/Navbar';

const SettingsPage = () => {
  const { isConnected, updateSettings, getSettings } = useArduinoApi();
  
  // Settings state
  const [maxWeightThreshold, setMaxWeightThreshold] = useState(70);
  const [maxTimeThreshold, setMaxTimeThreshold] = useState(30);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoConnect, setAutoConnect] = useState(true);
  
  // Form state
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    // Simulate fetching settings from API
    const loadSettings = async () => {
      try {
        // In a real app, you would get these values from your API
        // const settings = await getSettings();
        // setMaxWeightThreshold(settings.maxWeightThreshold);
        // setMaxTimeThreshold(settings.maxTimeThreshold);
        // setNotificationsEnabled(settings.notificationsEnabled);
        // setDarkMode(settings.darkMode);
        // setAutoConnect(settings.autoConnect);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    
    loadSettings();
  }, []);

  // Track changes to settings
  useEffect(() => {
    setIsChanged(true);
    setSaveSuccess(false);
  }, [maxWeightThreshold, maxTimeThreshold, notificationsEnabled, darkMode, autoConnect]);

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app you would call your API
      // await updateSettings({
      //   maxWeightThreshold,
      //   maxTimeThreshold,
      //   notificationsEnabled,
      //   darkMode,
      //   autoConnect
      // });
      
      setIsChanged(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default settings
  const handleReset = () => {
    setMaxWeightThreshold(70);
    setMaxTimeThreshold(30);
    setNotificationsEnabled(true);
    setDarkMode(false);
    setAutoConnect(true);
  };

  return (
    <div className="relative flex flex-col h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Header Bar */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Inflatacare<span className="text-blue-300">Settings</span>
        </h1>
        
        {/* Connection Status */}
        <div className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-200 animate-pulse' : 'bg-red-200'}`}></div>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 overflow-auto">
        {/* Settings Panel */}
        <div className="mb-4 p-4 rounded-lg bg-white shadow-md border-l-4 border-blue-500">
          <div className="flex items-center mb-2">
            <Sliders className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-lg md:text-xl font-medium text-gray-800">System Settings</h2>
          </div>
          <p className="text-gray-600">
            Configure threshold values and preferences for the Inflatacare system.
          </p>
        </div>
        
        {/* Settings Form */}
        <div className="flex-grow flex flex-col space-y-6 mb-4">
          {/* Pressure Threshold Settings - Primary Focus */}
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pressure Thresholds</h3>
            
            {/* Max Weight Threshold */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="maxWeightThreshold">
                Maximum Weight Threshold (g)
              </label>
              <div className="flex items-center">
                <input
                  id="maxWeightThreshold"
                  type="range"
                  min="10"
                  max="150"
                  value={maxWeightThreshold}
                  onChange={(e) => setMaxWeightThreshold(parseInt(e.target.value))}
                  className="w-full mr-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="w-16 px-2 py-1 bg-blue-100 text-blue-800 rounded text-center font-medium">
                  {maxWeightThreshold}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Alert will trigger when pressure exceeds this value. Recommended: 60-80g.
              </p>
            </div>
            
            {/* Max Time Threshold */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="maxTimeThreshold">
                Maximum Time Threshold (minutes)
              </label>
              <div className="flex items-center">
                <input
                  id="maxTimeThreshold"
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={maxTimeThreshold}
                  onChange={(e) => setMaxTimeThreshold(parseInt(e.target.value))}
                  className="w-full mr-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="w-16 px-2 py-1 bg-blue-100 text-blue-800 rounded text-center font-medium">
                  {maxTimeThreshold}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Alert when pressure exceeds threshold for this duration. Recommended: 20-40 minutes.
              </p>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 font-medium">Enable Alert Notifications</p>
                <p className="text-xs text-gray-500">Receive alerts when thresholds are exceeded</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          {/* System Settings */}
          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Preferences</h3>
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-700 font-medium">Dark Mode</p>
                <p className="text-xs text-gray-500">Use dark color theme throughout the app</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {/* Auto-Connect Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 font-medium">Auto-Connect</p>
                <p className="text-xs text-gray-500">Automatically connect to Arduino on startup</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={autoConnect}
                  onChange={() => setAutoConnect(!autoConnect)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between space-x-4 mb-6">
          <button
            onClick={handleReset}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </button>
          
          <button
            onClick={handleSave}
            disabled={!isChanged || isSaving}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg shadow-sm text-white
              ${!isChanged ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
        
        {/* Save Success Message */}
        {saveSuccess && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">Settings successfully saved!</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 p-2 text-xs text-center text-gray-500">
        Inflatacare System &copy; {new Date().getFullYear()}
      </footer>

      <BottomNavBar />
    </div>
  );
};

export default SettingsPage;