
import React, { useState } from 'react';
import type { Teacher, AttendanceRecord } from '../types';
import { FingerprintIcon, UserCheckIcon } from './icons';

interface FingerprintScannerProps {
  teachers: Teacher[];
  attendanceRecords: AttendanceRecord[];
  onClockIn: (teacherId: string) => void;
  onClockOut: (teacherId: string) => void;
}

type ViewState = 'idle' | 'success' | 'error';

const FingerprintScanner: React.FC<FingerprintScannerProps> = ({
  teachers,
  attendanceRecords,
  onClockIn,
  onClockOut,
}) => {
  const [statusMessage, setStatusMessage] = useState('Sentuh untuk Absen');
  const [viewState, setViewState] = useState<ViewState>('idle');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = () => {
    if (isProcessing) return;

    if (teachers.length === 0) {
      setStatusMessage('Tidak ada data guru. Harap hubungi admin.');
      setViewState('error');
      setTimeout(() => {
        setViewState('idle');
        setStatusMessage('Sentuh untuk Absen');
      }, 3000);
      return;
    }

    setIsProcessing(true);
    
    // Asumsikan guru pertama yang melakukan pemindaian untuk menyederhanakan alur.
    // Ini menghilangkan layar pemilihan guru sesuai permintaan.
    const teacher = teachers[0]; 

    const isCurrentlyClockedIn = attendanceRecords.some(
      (record) => record.teacherId === teacher.id && !record.clockOut
    );

    if (isCurrentlyClockedIn) {
      onClockOut(teacher.id);
      setStatusMessage(`Sampai jumpa, ${teacher.name}!`);
    } else {
      onClockIn(teacher.id);
      setStatusMessage(`Selamat datang, ${teacher.name}!`);
    }
    
    setViewState('success');
    
    setTimeout(() => {
      setViewState('idle');
      setStatusMessage('Sentuh untuk Absen');
      setIsProcessing(false);
    }, 2500);
  };
  
  const renderIdleView = () => (
    <div className="flex flex-col items-center justify-center w-full py-8">
        <button 
            onClick={handleScan}
            disabled={isProcessing}
            className="group rounded-full p-6 bg-white shadow-lg border-4 border-slate-200 transition-all duration-300 transform hover:scale-110 hover:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:opacity-50 disabled:cursor-wait"
            aria-label="Absen Sidik Jari"
        >
            <FingerprintIcon className="w-24 h-24 sm:w-32 sm:h-32 transition-colors duration-300 text-slate-400 group-hover:text-sky-500" />
        </button>
        <p className="text-xl sm:text-2xl font-semibold h-10 mt-10 transition-colors duration-300 text-slate-600">
            {statusMessage}
        </p>
    </div>
  );

  const renderFeedbackView = (isError: boolean) => {
    const iconColor = isError ? 'text-red-600' : 'text-green-600';
    return (
      <div className={`flex flex-col items-center justify-center animate-pulse py-8 ${iconColor}`}>
        <UserCheckIcon className="w-24 h-24 mb-4" />
        <p className="text-xl sm:text-2xl font-semibold text-center">{statusMessage}</p>
      </div>
    );
  };

  const renderContent = () => {
    switch (viewState) {
      case 'success':
        return renderFeedbackView(false);
      case 'error':
        return renderFeedbackView(true);
      case 'idle':
      default:
        return renderIdleView();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {renderContent()}
    </div>
  );
};

export default FingerprintScanner;
