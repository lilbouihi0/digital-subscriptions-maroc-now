
import React from "react";

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
  // Calculate the angle for each segment
  const segmentAngle = 360 / prizes.length;
  
  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto">
      {/* Pointer Triangle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-6 w-0 h-0 
        border-l-[20px] border-l-transparent 
        border-b-[36px] border-b-red-500 
        border-r-[20px] border-r-transparent z-10 drop-shadow-lg" />
        
      {/* Wheel */}
      <div 
        className="w-full h-full rounded-full border-8 border-indigo-800 dark:border-indigo-600 overflow-hidden"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 5s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)'
        }}
      >
        {/* Wheel segments */}
        <div className="w-full h-full relative">
          {prizes.map((prize, index) => {
            // Calculate rotation angle for this segment
            const rotationAngle = segmentAngle * index;
            
            return (
              <div 
                key={index}
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.cos((rotationAngle + segmentAngle) * Math.PI / 180)}% ${50 - 50 * Math.sin((rotationAngle + segmentAngle) * Math.PI / 180)}%)`,
                  backgroundColor: prize.color,
                  transform: `rotate(${rotationAngle}deg)`,
                  transformOrigin: 'center',
                }}
              >
                {/* Prize label */}
                <div 
                  className="absolute text-white font-bold text-center"
                  style={{ 
                    transform: `rotate(${segmentAngle / 2}deg)`,
                    top: '20%',
                    left: '50%',
                    marginLeft: '-30px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                    fontSize: '0.8rem',
                    width: '60px'
                  }}
                >
                  <div className="flex justify-center">
                    {prize.icon}
                  </div>
                  <div className="bg-black/40 p-1 rounded mt-1 text-xs">
                    {prize.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Center button */}
      <button 
        onClick={onSpin}
        disabled={spinDisabled}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500
          text-white font-bold rounded-full shadow-xl z-20 w-28 h-28 md:w-36 md:h-36
          flex flex-col items-center justify-center border-4 border-white/30
          transition-transform hover:scale-105 cursor-pointer animate-pulse
          disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
      >
        {spinText}
      </button>
      
      {/* Center circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-indigo-800/30 bg-gradient-to-br from-indigo-900/80 to-violet-900/80 z-10"></div>
    </div>
  );
};

export default SpinnerWheel;
