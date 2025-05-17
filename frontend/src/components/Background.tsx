import { motion } from 'framer-motion'

export const Background: React.FC = () => {
  return (
    <motion.div className="bg-black w-full h-full object-cover">
      <img
        src="/images/gameBoy/walls.png"
        className="min-w-full min-h-full"
      ></img>
    </motion.div>
  )
}
