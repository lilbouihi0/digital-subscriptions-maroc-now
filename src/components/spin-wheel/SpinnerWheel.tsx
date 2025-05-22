
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
  spinText = "Click to Spin",
  dir,
}) => {
  // Define fixed colors for the wheel segments
  const wheelColors = [
    "#FF6384", // Pink
    "#36A2EB", // Blue
    "#FFCE56", // Yellow
    "#4BC0C0", // Teal
    "#9966FF", // Purple
    "#FF9F40", // Orange
    "#C9CBCF", // Gray
    "#7BC043", // Green
  ];

  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto">
      {/* Pointer Triangle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-6 w-0 h-0 
        border-l-[20px] border-l-transparent 
        border-b-[36px] border-b-red-500 
        border-r-[20px] border-r-transparent z-10 drop-shadow-lg" />
        
      {/* Wheel - Completely new implementation */}
      <div 
        className="w-full h-full rounded-full border-8 border-indigo-800 dark:border-indigo-600 overflow-hidden"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 5s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)'
        }}
      >
        {/* Simple wheel with only colored segments */}
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          {/* Create segments based on number of prizes */}
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
            
            // Calculate position for text
            const midAngle = (startAngle + endAngle) / 2;
            const midRad = (midAngle - 90) * Math.PI / 180;
            const textDistance = 35; // Distance from center (0-50)
            const textX = 50 + textDistance * Math.cos(midRad);
            const textY = 50 + textDistance * Math.sin(midRad);
            
            // Calculate text rotation
            const textRotation = midAngle;
            const adjustedRotation = textRotation > 90 && textRotation < 270 ? textRotation + 180 : textRotation;
            
            return (
              <React.Fragment key={index}>
                <path 
                  d={pathData} 
                  fill={prize.color || wheelColors[index % wheelColors.length]}
                  stroke="#444" 
                  strokeWidth="0.5"
                />
                <text 
                  x={textX} 
                  y={textY} 
                  fill="white"
                  fontSize="4"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${adjustedRotation}, ${textX}, ${textY})`}
                  style={{ 
                    textShadow: '0px 0px 2px #000',
                    pointerEvents: 'none'
                  }}
                >
                  {prize.label}
                </text>
              </React.Fragment>
            );
          })}
          
          {/* Dividing lines for better segment visibility */}
          {prizes.map((_, index) => {
            const angle = (index * 360 / prizes.length - 90) * Math.PI / 180;
            const x = 50 + 50 * Math.cos(angle);
            const y = 50 + 50 * Math.sin(angle);
            
            return (
              <line 
                key={`line-${index}`}
                x1="50" 
                y1="50" 
                x2={x} 
                y2={y} 
                stroke="#444" 
                strokeWidth="1"
              />
            );
          })}
        </svg>
      </div>
      
      {/* Center button with text */}
      <button 
        onClick={onSpin}
        disabled={spinDisabled}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500
          rounded-full shadow-xl z-20 w-24 h-24 md:w-32 md:h-32
          flex flex-col items-center justify-center border-4 border-white/30
          transition-transform hover:scale-105 cursor-pointer animate-pulse
          disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
      >
        {/* Play icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        
        {/* Spin text */}
        <span className="text-white text-xs md:text-sm font-bold">{spinText}</span>
      </button>
      
      {/* Center circle - behind the button (lower z-index) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-indigo-800/30 bg-gradient-to-br from-indigo-900/80 to-violet-900/80 z-[5]"></div>
    </div>
  );
};

export default SpinnerWheel;
