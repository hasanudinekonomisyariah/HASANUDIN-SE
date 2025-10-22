import React from 'react';
import { useClock } from '../hooks/useClock';

const KioskClock: React.FC = () => {
    const currentTime = useClock();

    return (
        <div className="text-center py-8">
            <p className="font-mono text-5xl sm:text-7xl font-bold text-slate-800">{currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
            <p className="text-lg text-slate-500">{currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
    );
};

export default KioskClock;
