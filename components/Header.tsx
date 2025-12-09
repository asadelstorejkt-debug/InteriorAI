import React from 'react';
import { LayoutTemplate } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-6 md:px-12 flex items-center justify-between border-b border-neutral-200 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <LayoutTemplate className="w-6 h-6 text-neutral-800" />
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">InteriorAI</h1>
      </div>
      <nav>
        <a href="#" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          About
        </a>
      </nav>
    </header>
  );
};

export default Header;
