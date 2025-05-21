import { motion } from 'framer-motion'
import React, { useEffect } from 'react'
import { renderGlowEffect, renderScanlines, securityCameraStyle } from '../utils/gameEffects'

export const LoadingScreen: React.FC = () => {
  // Add style element to head on component mount
  useEffect(() => {
    // Create style element
    const styleEl = document.createElement('style')
    styleEl.innerHTML = `
      @keyframes progressBar {
        0% { width: 0%; }
        10% { width: 10%; }
        20% { width: 20%; }
        30% { width: 30%; }
        40% { width: 40%; }
        50% { width: 50%; }
        60% { width: 60%; }
        70% { width: 70%; }
        80% { width: 80%; }
        90% { width: 90%; }
        100% { width: 100%; }
      }
      
      /* Animation for percentage counter text */
      .loading-percentage {
        counter-reset: percentage 0;
        animation: count 13s linear forwards;
      }
      
      .loading-percentage::after {
        content: counter(percentage) '%';
      }
      
      @keyframes count {
        0% { counter-increment: percentage 0; }
        10% { counter-increment: percentage 10; }
        20% { counter-increment: percentage 20; }
        30% { counter-increment: percentage 30; }
        40% { counter-increment: percentage 40; }
        50% { counter-increment: percentage 50; }
        60% { counter-increment: percentage 60; }
        70% { counter-increment: percentage 70; }
        80% { counter-increment: percentage 80; }
        90% { counter-increment: percentage 90; }
        100% { counter-increment: percentage 100; }
      }
    `
    document.head.appendChild(styleEl)
    
    // Clean up
    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])

  return (
    <div
      className="w-screen h-screen flex justify-center items-center relative"
      style={securityCameraStyle}
    >
      {/* Background wall */}
      <img
        src="/images/wall.png"
        className="w-full h-full object-cover brightness-50 absolute inset-0"
        alt="Wall"
      />

      {/* Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-20">
        {renderScanlines()}
      </div>

      {/* Central glow effect */}
      {renderGlowEffect()}

      <div className="flex flex-col items-center z-20">
        {/* Breathing "GENERATING CASE FILE..." text with animation matching the title */}
        <motion.div
          className="text-green-500 font-mono text-xl mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1, 0.95] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          GENERATING CASE FILE...
        </motion.div>
        
        {/* Progress bar container */}
        <div className="w-64 h-6 bg-black border-2 border-green-500 p-0.5 rounded relative overflow-hidden">
          {/* Animated progress bar */}
          <div 
            className="h-full bg-green-500 rounded transition-all duration-1000 ease-linear relative overflow-hidden"
            style={{ 
              animation: 'progressBar 13s linear forwards',
              width: '0%'
            }}
          >
            {/* Optional: Add scanner line effect inside the progress bar */}
            <div className="absolute h-full w-1 bg-green-200 opacity-30 animate-pulse"></div>
          </div>
          
          {/* Progress percentage counter */}
          <div className="absolute inset-0 flex items-center justify-center text-green-500 font-mono text-sm tracking-wider mix-blend-difference">
            <span className="loading-percentage"></span>
          </div>
        </div>
        
        {/* Status text */}
        <div className="text-green-500 font-mono text-xs mt-3">
          ENCRYPTING DATA...
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen