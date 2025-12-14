import React from 'react';

export default function Navigation() {
  return(
    <nav className="bg-gray-800">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div>
              <span>Home</span>
            </div>
            <div>
              <span>Search</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
