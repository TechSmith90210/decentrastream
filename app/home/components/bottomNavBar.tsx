import React from 'react';
import { Home, Upload, Settings, Flame } from 'lucide-react';

const BottomNavbar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-secondary text-foreground p-4 flex justify-around">
      <a href="#" className="flex flex-col items-center">
        <Home className="w-6 h-6" />
        <span className="text-xs">Home</span>
      </a>
      <a href="#" className="flex flex-col items-center">
        <Upload className="w-6 h-6" />
        <span className="text-xs">Upload</span>
      </a>
      <a href="#" className="flex flex-col items-center">
        <Flame className="w-6 h-6" />
        <span className="text-xs">Trending</span>
      </a>
      <a href="#" className="flex flex-col items-center">
        <Settings className="w-6 h-6" />
        <span className="text-xs">Settings</span>
      </a>
    </nav>
  );
};

export default BottomNavbar;