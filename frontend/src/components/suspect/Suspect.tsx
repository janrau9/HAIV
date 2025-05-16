import { motion } from 'framer-motion'

interface SuspectProps {
  imgUrl: string
}

export const Suspect: React.FC<SuspectProps> = ({ imgUrl }) => {
  return (
    <motion.img
      key={imgUrl}
      className="absolute bottom-0 left-1/2 -translate-x-[50%] -translate-y-[40%] max-h-[60%]"
      src={imgUrl}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        y: [0, -5, 0],
      }}
      exit={{ opacity: 0, y: 50 }}
      transition={{
        opacity: { duration: 1 },
        scale: { duration: 0.4 },
        y: {
          duration: 3,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        },
      }}
    />
  )
}
