
import React from "react";

interface SpinnerWheelProps {
  prizes: any[];
  rotation: number;
  isSpinning: boolean;
  onSpin: () => void;
  spinDisabled: boolean;
  spinText: React.ReactNode;
}

const SpinnerWheel: React.FC<SpinnerWheelProps> = ({
  prizes,
  rotation,
  isSpinning,
  onSpin,
  spinDisabled,
  spinText,
}) => {
  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Pointer Triangle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-0 h-0 
        border-l-[18px] border-l-transparent 
        border-b-[32px] border-b-red-500 
        border-r-[18px] border-r-transparent z-10 drop-shadow-lg" />
        
      {/* Wheel */}
      <div 
        className="w-full h-full rounded-full border-4 border-indigo-800 overflow-hidden transition-transform duration-5000 ease-out"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transitionDuration: isSpinning ? '5s' : '0s',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)'
        }}
      >
        {prizes.map((prize, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{
              transform: `rotate(${i * (360 / prizes.length)}deg)`,
              transformOrigin: 'center',
              clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 50%)',
              backgroundColor: prize.color
            }}
          >
            <div 
              className="absolute top-[15%] left-[70%] -translate-x-1/2 -translate-y-1/2 text-white font-bold flex flex-col items-center justify-center transition-opacity"
              style={{ 
                fontSize: prize.label.length > 9 ? '0.75rem' : prize.label.length > 6 ? '0.85rem' : '1rem',
                transform: `rotate(${90 - (360 / prizes.length) / 2}deg)`,
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                width: '60px',
                textAlign: 'center',
              }}
            >
              {prize.icon}
              <span className="text-center whitespace-pre-wrap mt-1">{prize.label}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Center button - enlarged and enhanced */}
      <button 
        onClick={onSpin} 
        disabled={spinDisabled}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700
          text-white font-bold rounded-full shadow-lg z-20 w-28 h-28
          flex flex-col items-center justify-center border-4 border-white/30
          transition-transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
      >
        {spinText}
      </button>
      
      {/* Decorative dots around the center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-4 border-dashed border-white/30 animate-spin-slow" style={{ animationDuration: '120s' }}></div>
    </div>
  );
};

export default SpinnerWheel;
