import { Home, Sliders } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNavBar() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-blue-50 flex justify-around py-5 shadow-lg border-t border-blue-100">
      <Link
        to="/"
        className={`flex flex-col items-center ${location.pathname === "/" ? "text-blue-400" : "text-gray-400"}`}
      >
        <Home size={32} />
        <span className="text-base mt-1">Home</span>
      </Link>
      <Link
        to="/control"
        className={`flex flex-col items-center ${location.pathname === "/control" ? "text-blue-400" : "text-gray-400"}`}
      >
        <Sliders size={32} />
        <span className="text-base mt-1">Control</span>
      </Link>
    </div>
  );
}