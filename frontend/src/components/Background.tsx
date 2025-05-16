




import {motion} from 'framer-motion'



export const Background:React.FC = () => {
	return (
		<motion.div
		className='bg-black w-screen h-screen object-cover'
		>
			<img src="/images/walls.png" className="min-w-full min-h-full"></img>
		</motion.div>
	);
  };




