




import {motion} from 'framer-motion'



export const Background:React.FC = () => {
	return (
		<motion.div
		className='bg-black w-screen h-screen object-contain'
		>
			<img src="/images/wall.png" className="w-full h-full"></img>
		</motion.div>
	);
  };




