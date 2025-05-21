import { motion } from 'framer-motion'

export const Background: React.FC = () => {
  return (
    <motion.div className="bg-black w-full h-full object-cover relative">
      <img
        src="/images/gameBoy/walls.png"
        className="min-w-full min-h-full"
      ></img>

      <div className="absolute top-3 left-3 text-green-500 font-mono text-xs">
        REC ● {new Date().toLocaleTimeString()}
      </div>

      <div className="absolute top-3 right-3 text-green-500 font-mono text-xs">
        CAM-01 :: INTERROGATION
      </div>
    </motion.div>
  )
}
