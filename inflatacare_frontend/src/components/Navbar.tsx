import { Home, Sliders, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNavBar() {
  const location = useLocation();

  return (
    <div className="bottom-0 left-0 right-0 w-full bg-blue-50 flex justify-around py-3 shadow-lg border-t border-blue-100 z-50">
      <Link
        to="/"
        className={`flex flex-col items-center ${location.pathname === "/" ? "text-blue-400" : "text-gray-400"}`}
      >
        <Home size={24} />
        <span className="text-sm mt-1">Home</span>
      </Link>
      <Link
        to="/control"
        className={`flex flex-col items-center ${location.pathname === "/control" ? "text-blue-400 font-medium" : "text-gray-400"}`}
      >
        <Sliders size={24} />
        <span className="text-sm mt-1">Control</span>
      </Link>
      <Link
          to="/settings"
          className={`flex flex-col items-center px-4 py-2 rounded-lg ${
            location.pathname === "/settings" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
    </div>
  );
}