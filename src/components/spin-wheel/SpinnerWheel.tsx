
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
  spinSound?: string; // URL to the spinning sound
  winSound?: string;  // URL to the winning sound
}

const SpinnerWheel: React.FC<SpinnerWheelProps> = ({
  prizes,
  rotation,
  isSpinning,
  onSpin,
  spinDisabled,
  spinText = "Click to Spin",
  dir,
  spinSound,
  winSound,
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
  
  // Create refs for audio elements
  const spinAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const winAudioRef = React.useRef<HTMLAudioElement | null>(null);
  
  // Function to handle spin with sound
  const handleSpin = () => {
    // Play spin sound if available
    if (spinAudioRef.current && spinSound) {
      spinAudioRef.current.currentTime = 0;
      spinAudioRef.current.play().catch(e => console.error("Error playing spin sound:", e));
    }
    
    // Call the original onSpin function
    onSpin();
    
    // If wheel is starting to spin and we have a win sound, set up a listener to play it when spinning stops
    if (!isSpinning && winSound) {
      const timeoutId = setTimeout(() => {
        if (winAudioRef.current) {
          winAudioRef.current.currentTime = 0;
          winAudioRef.current.play().catch(e => console.error("Error playing win sound:", e));
        }
      }, 5000); // Approximate time for the wheel to stop spinning
      
      return () => clearTimeout(timeoutId);
    }
  };

  return (
    <div className="relative w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] mx-auto">
      {/* Pointer Triangle - Positioned at the top pointing down at the wheel */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 
        border-l-[18px] border-l-transparent 
        sm:border-l-[24px] sm:border-l-transparent 
        md:border-l-[28px] md:border-l-transparent 
        border-t-[28px] border-t-red-500 
        sm:border-t-[40px] sm:border-t-red-500 
        md:border-t-[48px] md:border-t-red-500 
        border-r-[18px] border-r-transparent 
        sm:border-r-[24px] sm:border-r-transparent 
        md:border-r-[28px] md:border-r-transparent 
        z-10 drop-shadow-lg" 
        style={{ marginTop: '-1px' }} 
      ></div>
      {/* Wheel - Completely new implementation */}
      <div 
        className="w-full h-full rounded-full border-4 sm:border-8 md:border-10 lg:border-12 border-indigo-800 dark:border-indigo-600 overflow-hidden"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 5s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
          boxShadow: '0 6px 30px rgba(0,0,0,0.4) sm:0 10px 50px rgba(0,0,0,0.4)'
        }}
        onTransitionEnd={() => {
          // Log the final rotation for debugging
          console.log(`Wheel stopped at rotation: ${rotation}°`);
        }}
      >
        {/* Simple wheel with only colored segments */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>
          {/* Small marker at the top (0 degrees) for debugging */}
          <circle cx="50" cy="0" r="1" fill="white" style={{ opacity: 0.5 }} />
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
            
            // Calculate position for text - improved centering
            const midAngle = (startAngle + endAngle) / 2;
            const midRad = (midAngle - 90) * Math.PI / 180;
            
            // Position text for the exact format
            // Smaller segments (more prizes) need text closer to the edge
            const segmentSize = 360 / prizes.length;
            const textDistanceBase = 33; // Adjusted distance for the new text format
            // Adjust distance based on segment size - larger segments = text more toward center
            const textDistance = textDistanceBase - (8 - Math.min(8, prizes.length)) * 0.8;
            
            // Calculate text length adjustment based on the actual text content
            let textLengthAdjustment = 0;
            if (prize.label.includes('Cashback') || prize.label.includes('Discount')) {
                textLengthAdjustment = 1.2; // More adjustment for longer text
            } else if (prize.label.includes('FreeAccount')) {
                textLengthAdjustment = 0.8;
            } else {
                textLengthAdjustment = 0.5;
            }
            
            // Calculate final text position with all adjustments
            const finalTextDistance = textDistance + textLengthAdjustment;
            const textX = 50 + finalTextDistance * Math.cos(midRad);
            const textY = 50 + finalTextDistance * Math.sin(midRad);
            
            // Calculate text rotation - improved for better readability
            const textRotation = midAngle;
            // Adjust rotation to ensure text is always upright and readable
            // This flips text that would appear upside down
            const adjustedRotation = textRotation > 90 && textRotation < 270 ? textRotation + 180 : textRotation;
            
            return (
              <g key={index}>
                <path 
                  d={pathData} 
                  fill={prize.color || wheelColors[index % wheelColors.length]}
                  stroke="#444" 
                  strokeWidth="0.8"
                />
                {/* Render text in multiple lines if needed */}
                <g transform={`rotate(${adjustedRotation}, ${textX}, ${textY})`}>
                  {(() => {
                    // Process text to better handle prizes with emojis and percentages
                    const processText = () => {
                      let text = prize.label;
                      const lines: string[] = [];
                      
                      // Extract emojis to handle them separately
                      const emojiMatch = text.match(/(\p{Emoji})/gu);
                      const hasEmoji = emojiMatch && emojiMatch.length > 0;
                      
                      // If there's an emoji at the start, separate it
                      if (hasEmoji && text.match(/^(\p{Emoji})/u)) {
                        const emoji = emojiMatch[0];
                        text = text.replace(/^(\p{Emoji})\s*/u, '');
                        // Add emoji as its own line with special handling
                        if (emoji) {
                          // We'll handle emoji font size separately when rendering
                          lines.push(`EMOJI:${emoji}`);
                        }
                      }
                      
                      // Log the original text for debugging
                      console.log("Original prize text:", text);
                      
                      // DO NOT modify the text format - preserve exact spacing
                      // We'll handle the specific patterns directly
                      
                      // For exact text matching, we'll use the original text
                      // rather than splitting and rejoining which might alter spacing
                      const prizeText = text.trim();
                      
                      // Handle exact text formats as specified
                      
                      // Handle exact formats with precise pattern matching
                      
                      // Handle "Get10 %Cashback" or similar patterns
                      if (/Get(\d+)\s*%Cashback/i.test(prizeText)) {
                        const matches = prizeText.match(/Get(\d+)\s*%Cashback/i);
                        if (matches && matches.length >= 2) {
                          lines.push(`${matches[1]} %Cashback`);
                          return lines;
                        }
                      }
                      
                      // Handle "10 %Discount" or similar patterns
                      if (/(\d+)\s*%Discount/i.test(prizeText)) {
                        const matches = prizeText.match(/(\d+)\s*%Discount/i);
                        if (matches && matches.length >= 2) {
                          lines.push(`${matches[1]} %Discount`);
                          return lines;
                        }
                      }
                      
                      // Handle "Get aFreeAccount" pattern
                      if (/GetaFreeAccount/i.test(prizeText) || /Get\s+aFreeAccount/i.test(prizeText)) {
                        lines.push("FreeAccount");
                        return lines;
                      }
                      
                      // Handle "Try again" pattern
                      if (/Try\s*again/i.test(prizeText)) {
                        lines.push("Try again");
                        return lines;
                      }
                      
                      // If no pattern matches, log it for debugging and return a simplified version
                      console.log("No pattern match for:", prizeText);
                      
                      // Try to extract numbers and key terms
                      const numMatch = prizeText.match(/(\d+)/);
                      const number = numMatch ? numMatch[1] : '';
                      
                      if (prizeText.includes('Cashback')) {
                        lines.push(`${number} %Cashback`);
                      } else if (prizeText.includes('Discount')) {
                        lines.push(`${number} %Discount`);
                      } else if (prizeText.includes('Free')) {
                        lines.push('FreeAccount');
                      } else if (prizeText.includes('Try')) {
                        lines.push('Try again');
                      } else {
                        // Last resort - just use the text without "Get"
                        lines.push(prizeText.replace(/^Get\s+/i, ''));
                      }
                      
                      return lines;
                    };
                    
                    // Get the processed lines
                    const lines = processText();
                    
                    // For the exact text format, we mostly have single lines
                    // so we can simplify the line height calculation
                    const lineHeight = 5;
                    const totalHeight = (lines.length - 1) * lineHeight;
                    
                    // Render each line with improved vertical alignment
                    return lines.map((line, lineIndex) => {
                      // Center the text vertically with adjustments for emoji lines
                      let yOffset = lineIndex * lineHeight - totalHeight / 2;
                      
                      // Adjust vertical position for emoji lines - reduced offsets
                      if (line.startsWith('EMOJI:')) {
                        // Move emoji down slightly for better visual balance
                        yOffset += 0.5;
                      } else if (lineIndex > 0 && lines[0].startsWith('EMOJI:')) {
                        // Move text lines down slightly when following an emoji
                        yOffset += 0.8;
                      }
                      
                      // Add a small vertical adjustment to center text better in the segment
                      yOffset += 0.3;
                      
                      // Adjusted font sizes for the exact text format
                      let fontSize = 3.5;
                      
                      // Special handling for emoji lines
                      if (line.startsWith('EMOJI:')) {
                        fontSize = 5; // Emoji size
                        line = line.replace('EMOJI:', ''); // Remove the marker
                      } else {
                        // Regular text sizing based on length
                        if (line.length > 8) fontSize = 3.2;
                        if (line.length > 12) fontSize = 2.8;
                        
                        // Special case for longer single-line text
                        if (lines.length === 1 && line.length > 8) {
                          fontSize = 3;
                        }
                      }
                      
                      return (
                        <text 
                          key={lineIndex}
                          x={textX} 
                          y={textY + yOffset} 
                          fill="white"
                          fontSize={fontSize}
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{ 
                            textShadow: '0px 0px 2px #000, 1px 1px 1px rgba(0,0,0,0.8)',
                            pointerEvents: 'none',
                            fontFamily: "'Arial Black', 'Arial Bold', Gadget, sans-serif",
                            letterSpacing: '0.1px'
                          }}
                        >
                          {line}
                        </text>
                      );
                    });
                  })()}
                </g>
              </g>
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
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>
      
      {/* Audio elements for sounds */}
      {spinSound && <audio ref={spinAudioRef} src={spinSound} preload="auto" />}
      {winSound && <audio ref={winAudioRef} src={winSound} preload="auto" />}
      
      {/* Center button with text */}
      <button 
        onClick={handleSpin}
        disabled={spinDisabled}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500
          rounded-full shadow-xl z-20 w-[5.5rem] h-[5.5rem] sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40
          flex items-center justify-center border-2 sm:border-3 md:border-4 border-white/30
          transition-transform hover:scale-105 cursor-pointer animate-pulse
          disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
      >
        {/* Spin text - centered */}
        <div className="text-white font-bold text-center w-full h-full flex items-center justify-center overflow-hidden px-1 sm:px-2 text-base sm:text-lg md:text-xl lg:text-2xl">
          {spinText}
        </div>
      </button>
      
      {/* Center circle - behind the button (lower z-index) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6.5rem] h-[6.5rem] sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full border-2 sm:border-3 md:border-4 border-indigo-800/30 bg-gradient-to-br from-indigo-900/80 to-violet-900/80 z-[5]"></div>
    </div>
  );
};

export default SpinnerWheel;
