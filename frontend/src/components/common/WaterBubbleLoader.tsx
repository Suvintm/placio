import React from 'react';
import './WaterBubbleLoader.css';

interface WaterBubbleLoaderProps {
  text?: string;
  fullScreen?: boolean;
}

const WaterBubbleLoader: React.FC<WaterBubbleLoaderProps> = ({ 
  text = "Loading...", 
  fullScreen = false 
}) => {
  const loaderContent = (
    <div className="water-bubble-container">
      {/* SVG Filter for Gooey Liquid Effect */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="bubble-wrapper">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-main"></div>
      </div>
      
      {text && <div className="bubble-text">{text}</div>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fullscreen-loader-overlay">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default WaterBubbleLoader;
