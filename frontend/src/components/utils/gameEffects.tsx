import { CSSProperties } from 'react'

// Security camera style filter
export const securityCameraStyle: CSSProperties = {
  filter: 'sepia(0.3) hue-rotate(90deg) brightness(0.8) contrast(1.2)',
  boxShadow: 'inset 0 0 30px rgba(0, 255, 0, 0.3), 0 0 10px rgba(0, 255, 0, 0.5)',
}

// Animation variants for staggered animations
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.2,
      duration: 0.5,
    },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

// Create scanlines as React component props
export const renderScanlines = () => {
  return [...Array(100)].map((_, i) => (
    <div
      key={i}
      className="w-full h-px bg-green-500"
      style={{
        position: 'absolute',
        top: `${i * 10}px`,
        opacity: i % 3 === 0 ? 0.8 : 0.3,
      }}
    />
  ))
}

// Render glow effect
export const renderGlowEffect = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-green-500 opacity-10 filter blur-xl z-10" />
  )
}
