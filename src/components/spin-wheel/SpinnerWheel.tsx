
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
        {/* SVG Wheel */}
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          {prizes.map((prize, index) => {
            const segmentAngle = 360 / prizes.length;
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            
            // Convert angles to radians for calculations
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;
            
            // Calculate arc points
            const x1 = 50 + 50 * Math.cos(startRad);
            const y1 = 50 + 50 * Math.sin(startRad);
            const x2 = 50 + 50 * Math.cos(endRad);
            const y2 = 50 + 50 * Math.sin(endRad);
            
            // Determine if we need a large arc
            const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
            
            // Create the path for the segment
            const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            // Calculate position for the label
            const midAngle = (startAngle + endAngle) / 2;
            const midRad = (midAngle - 90) * Math.PI / 180;
<<<<<<< HEAD
            const labelRadius = 20; // Extremely reduced radius to position labels very close to center
=======
            // Position labels at 70% of the radius (35 units) for better readability
            const labelRadius = 35; 
>>>>>>> ca9819516b8ec34c7228a33c20104b281303a447
            const labelX = 50 + labelRadius * Math.cos(midRad);
            const labelY = 50 + labelRadius * Math.sin(midRad);
            
            return (
              <g key={index}>
                {/* Segment */}
                <path 
                  d={pathData} 
                  fill={prize.color} 
                  stroke="#444" 
                  strokeWidth="0.5"
                />
                
                {/* Icon only - no text */}
                <g transform={`translate(${labelX}, ${labelY}) rotate(${midAngle})`}>
<<<<<<< HEAD
                  <foreignObject x="-8" y="-8" width="16" height="16" style={{ overflow: 'hidden' }}>
                    <div 
                      className="text-yellow-300 flex items-center justify-center"
                      style={{ 
                        transform: `rotate(-${midAngle}deg)`,
                        width: '16px',
                        height: '16px'
                      }}
                    >
                      <div style={{ transform: 'scale(0.6)' }}>
                        {prize.icon}
                      </div>
=======
                  <foreignObject x="-20" y="-20" width="40" height="40" style={{ overflow: 'visible' }}>
                    <div 
                      className="text-white font-bold text-center flex flex-col items-center"
                      style={{ 
                        transform: `rotate(-${midAngle}deg)`,
                        textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                        fontSize: '0.7rem',
                        width: '100px',
                        marginLeft: '-30px', // Center the wider text box
                      }}
                    >
                      <div className="flex justify-center mb-1">
                        {prize.icon}
                      </div>
                      <div 
                        className="bg-black/50 p-1 rounded mx-auto max-w-[80px] whitespace-normal break-words"
                        style={{ wordWrap: 'break-word' }}
                      >
                        {prize.label}
                      </div>
>>>>>>> ca9819516b8ec34c7228a33c20104b281303a447
                    </div>
                  </foreignObject>
                </g>
              </g>
            );
          })}
        </svg>
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
