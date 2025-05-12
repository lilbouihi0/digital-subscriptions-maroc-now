
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
  onTickSound: () => void;
}

const SpinnerWheel: React.FC<SpinnerWheelProps> = ({
  prizes,
  rotation,
  isSpinning,
  onSpin,
  spinDisabled,
  spinText,
  dir,
  onTickSound,
}) => {
  const lastRotationRef = useRef(0);
  
  // Play tick sound at intervals during spinning
  useEffect(() => {
    let tickInterval: NodeJS.Timeout | null = null;
    
    if (isSpinning && onTickSound) {
      // Play tick sound every time wheel passes a segment
      tickInterval = setInterval(() => {
        // Calculate current rotation in degrees, accounting for multiple rotations
        const currentRotationDegrees = (rotation % 360);
        const lastRotationDegrees = (lastRotationRef.current % 360);
        
        // If we've passed a segment boundary (every 60 degrees)
        if (Math.floor(currentRotationDegrees / 60) !== Math.floor(lastRotationDegrees / 60)) {
          onTickSound();
        }
        
        lastRotationRef.current = rotation;
      }, 50); // Check frequently for smooth sound
    }
    
    return () => {
      if (tickInterval) clearInterval(tickInterval);
    };
  }, [isSpinning, rotation, onTickSound]);

  return (
    <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] mx-auto">
      {/* Pointer Triangle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-6 w-0 h-0 
        border-l-[24px] border-l-transparent 
        border-b-[42px] border-b-red-500 
        border-r-[24px] border-r-transparent z-10 drop-shadow-lg" />
        
      {/* Wheel */}
      <div 
        className="w-full h-full rounded-full border-8 border-indigo-800 overflow-hidden transition-transform ease-cubic-out"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transitionDuration: isSpinning ? '5s' : '0s',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' // easeOutCubic
        }}
      >
        {prizes.map((prize, i) => {
          // Calculate the rotation angle for this segment (60 degrees per segment)
          const segmentAngle = i * (360 / prizes.length);
          // Text rotation adjustment depends on direction
          const textRotationAdjustment = dir === 'rtl' ? -90 : 90;
          
          return (
            <div
              key={i}
              className="absolute w-full h-full"
              style={{
                transform: `rotate(${segmentAngle}deg)`,
                transformOrigin: 'center',
                clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 50%)',
                backgroundColor: prize.color
              }}
            >
              <div 
                className="absolute top-[22%] left-[70%] -translate-x-1/2 -translate-y-1/2 text-white font-bold flex flex-col items-center justify-center"
                style={{ 
                  fontSize: prize.label.length > 12 ? '1rem' : prize.label.length > 9 ? '1.1rem' : '1.2rem',
                  transform: `rotate(${textRotationAdjustment - (360 / prizes.length) / 2}deg)`,
                  textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                  width: '100px',
                  textAlign: 'center',
                }}
              >
                <div className="text-3xl mb-1">{prize.icon}</div>
                <span className="text-center whitespace-pre-wrap">{prize.label}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Center circle decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-56 md:h-56 rounded-full border-4 border-indigo-800/30 bg-gradient-to-br from-indigo-900/80 to-violet-900/80"></div>
      
      {/* Center button - enlarged */}
      <button 
        onClick={onSpin}
        disabled={spinDisabled}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500
          text-white font-bold rounded-full shadow-xl z-20 w-28 h-28 md:w-40 md:h-40
          flex flex-col items-center justify-center border-4 border-white/30
          transition-transform hover:scale-105 disabled:opacity-80 disabled:hover:scale-100"
      >
        {spinText}
      </button>
      
      {/* Decorative dots around the center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-dashed border-white/20 animate-spin-slow" style={{ animationDuration: '120s' }}></div>
    </div>
  );
};

export default SpinnerWheel;
