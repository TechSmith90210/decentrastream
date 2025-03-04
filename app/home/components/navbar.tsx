// components/Navbar.jsx
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-secondary shadow-md p-3 border-b border-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-foreground font-heading text-lg">
          DecentraStream
        </div>
      </div>
    </nav>
  );
};

export default Navbar;