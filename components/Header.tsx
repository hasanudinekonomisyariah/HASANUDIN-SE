import React, { useState, useEffect } from 'react';
import { useClock } from '../hooks/useClock';
import { MaximizeIcon, MinimizeIcon, FingerprintIcon, LayoutDashboardIcon } from './icons';

interface HeaderProps {
    view: 'kiosk' | 'admin';
    onViewChangeRequest: (view: 'kiosk' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ view, onViewChangeRequest }) => {
  const currentTime = useClock();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleView = () => {
    onViewChangeRequest(view === 'kiosk' ? 'admin' : 'kiosk');
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <header className="bg-sky-600 text-white shadow-lg p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Aplikasi Absensi Pegawai ASN</h1>
        <p className="text-sm md:text-base text-sky-200">SD Negeri 2 Pongo</p>
      </div>
      <div className="text-right flex items-center space-x-2 sm:space-x-4">
        <div className="hidden sm:block text-center">
            <p className="font-mono text-lg">{currentTime.toLocaleTimeString()}</p>
            <p className="text-xs text-sky-200">{currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
         <button
          onClick={toggleView}
          className="p-2 rounded-full hover:bg-sky-500 transition-colors duration-200"
          title={view === 'kiosk' ? "Dasbor Admin" : "Tampilan Kiosk"}
        >
          {view === 'kiosk' ? <LayoutDashboardIcon className="w-6 h-6" /> : <FingerprintIcon className="w-6 h-6" />}
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full hover:bg-sky-500 transition-colors duration-200"
          title={isFullscreen ? "Keluar Layar Penuh" : "Masuk Layar Penuh"}
        >
          {isFullscreen ? <MinimizeIcon className="w-6 h-6" /> : <MaximizeIcon className="w-6 h-6" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
