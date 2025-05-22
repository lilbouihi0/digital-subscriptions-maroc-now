
import React, { useEffect, useRef } from "react";

interface SpinnerWheelProps {
  prizes: {
    value: string;
    label: string;
    icon: React.ReactNode;
    probability: number;
    color: string;
  }[];
  rotation: number;
  isSpinning: boolean;
  onSpin: () => void;
  spinDisabled: boolean;
  spinText: React.ReactNode;
  dir: "ltr" | "rtl";
}

const SpinnerWheel: React.FC<SpinnerWheelProps> = ({
  prizes,
  rotation,
  isSpinning,
  onSpin,
  spinDisabled,
  spinText,
  dir,
}) => {
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);
  const endAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const tryAgainAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements
  useEffect(() => {
    // Tick sound for spinning
    tickAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3');
    tickAudioRef.current.volume = 0.3;
    
    // End sound when wheel stops
    endAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3');
    endAudioRef.current.volume = 0.5;
    
    // Win sound
    winAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1500/1500-preview.mp3');
    winAudioRef.current.volume = 0.6;

    // Try again sound
    tryAgainAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/938/938-preview.mp3');
    tryAgainAudioRef.current.volume = 0.5;
    
    return () => {
      // Cleanup
      [tickAudioRef, endAudioRef, winAudioRef, tryAgainAudioRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current.currentTime = 0;
        }
      });
    };
  }, []);

  // Play tick sound at intervals during spinning
  useEffect(() => {
    let tickInterval: NodeJS.Timeout | null = null;
    
    if (isSpinning && tickAudioRef.current) {
      // Play tick sound every 100ms while spinning
      tickInterval = setInterval(() => {
        if (tickAudioRef.current) {
          tickAudioRef.current.currentTime = 0;
          tickAudioRef.current.play().catch(e => console.log("Audio play error:", e));
        }
      }, 100);
    }
    
    return () => {
      if (tickInterval) clearInterval(tickInterval);
    };
  }, [isSpinning]);

  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto">
      {/* Pointer Triangle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-6 w-0 h-0 
        border-l-[20px] border-l-transparent 
        border-b-[40px] border-b-red-500 
        border-r-[20px] border-r-transparent z-10 drop-shadow-lg" />
        
      {/* Wheel */}
      <div 
        className="w-full h-full rounded-full border-[12px] border-blue-800 overflow-hidden"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 5s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)'
        }}
      >
        {/* Wheel Segments */}
        {prizes.map((prize, i) => {
          // Calculate the rotation angle for this segment (60 degrees per segment for 6 segments)
          const segmentAngle = i * (360 / prizes.length);
          
          return (
            <div
              key={i}
              className="absolute w-full h-full"
              style={{
                transform: `rotate(${segmentAngle}deg)`,
                transformOrigin: 'center',
                clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 50%)',
                backgroundColor: prize.color,
                borderRight: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <div 
                className="absolute top-[22%] left-[75%] -translate-x-1/2 -translate-y-1/2 text-white font-bold flex flex-col items-center justify-center"
                style={{ 
                  transform: `rotate(${45 + (360 / prizes.length) / 2}deg)`,
                  textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                  maxWidth: '100px',
                  textAlign: 'center',
                }}
              >
                <div className="text-2xl mb-1">{prize.icon}</div>
                <div className="bg-black/60 px-2 py-1 rounded-md text-center text-sm md:text-base whitespace-normal line-clamp-2">
                  {prize.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Center circle decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] rounded-full border-4 border-blue-800/30 bg-gradient-to-br from-blue-900/90 to-indigo-900/90 z-10"></div>
      
      {/* Center button */}
      <button 
        onClick={onSpin}
        disabled={spinDisabled}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400
          text-white font-bold rounded-full shadow-xl z-20 w-28 h-28 md:w-32 md:h-32
          flex flex-col items-center justify-center border-4 border-white/30
          transition-transform hover:scale-105 disabled:opacity-80 disabled:hover:scale-100"
      >
        {spinText}
      </button>
      
      {/* Decorative dots around the center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] rounded-full border-4 border-dashed border-white/20 animate-spin-slow" style={{ animationDuration: '120s' }}></div>

      {/* Outer ring */}
      <div className="absolute inset-0 border-[16px] border-blue-800 rounded-full pointer-events-none"></div>
    </div>
  );
};

export default SpinnerWheel;
