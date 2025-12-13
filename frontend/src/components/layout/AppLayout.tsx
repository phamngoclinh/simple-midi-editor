import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { footerStyle } from './AppLayout.styles';
import useSongManager from '../../hooks/useSongManager';

interface AppLayoutProps {}

const AppLayout: React.FC<AppLayoutProps> = () => {
  const { importSong } = useSongManager();
  return (
    <div className='flex flex-col h-full'>
      <header className='flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-[#282e39] bg-[#111318] px-6 py-3 z-20'>
        <div className="flex items-center gap-2 text-white">
            <div className="size-8 text-primary">
              <span className="material-symbols-outlined !text-3xl">piano</span>
            </div>
            <Link to="/" className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Simple Midi Editor</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            className="flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-white text-sm font-bold hover:bg-blue-600 transition-colors"
            onClick={importSong}
          >
            <span className="material-symbols-outlined text-sm mr-2">ios_share</span> Import
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Outlet /> 
      </div>
      
      <footer style={footerStyle}>
        <p>&copy; 2025 Simple Midi Editor</p>
      </footer>
    </div>
  );
};

export default AppLayout;
