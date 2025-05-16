




import {motion} from 'framer-motion'

interface SuspectProps {
	imgUrl: string;
}

export const Suspect:React.FC<SuspectProps> = ({ imgUrl }) => {
	return (
		<motion.img
		className="absolute bottom-0 left-1/2 -translate-x-[50%] -translate-y-[40%] max-h-[60%]"
		src={imgUrl}
		animate={{
		  y: [0, -5, 0], // Moves up 10px then back down
		}}
		transition={{
		duration: 3,
		repeat: Infinity,
		repeatType: "loop",
		ease: "easeInOut",
		}}
		/>
	);
  };




