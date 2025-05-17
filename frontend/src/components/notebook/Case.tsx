import { CasePolaroid } from "./Polaroid"

export const Case:React.FC = () => {
	return (
	  <div className="w-full flex justify-center items-center gap-2 p-4 flex-col">
			  <h1 className="font-bold uppercase text-center text-2xl text-red-400">Casefile</h1>
  
		<div>
		<div className="float-left mr-4 mb-4 ">
		  <CasePolaroid imgUrl={'/images/mansion.png'}></CasePolaroid>
		</div>
		<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vulputate efficitur est nec tempus. Curabitur commodo enim vitae quam pretium, a iaculis quam tristique. Pellentesque tincidunt lectus at nulla tempor, vitae ultrices ante volutpat. Nulla ultricies, neque nec malesuada pulvinar, tortor diam auctor metus, et luctus elit libero sit amet est. Vivamus eu ornare neque, in tempus nunc. Duis eu sollicitudin nisi, quis eleifend turpis. Cras sollicitudin laoreet ultricies. Aenean dignissim mollis ex. Proin id urna et tortor faucibus vulputate in ac mi. Aliquam finibus vulputate purus ac viverra. Morbi a euismod ante, id rhoncus sem. Morbi tincidunt mattis ex, sit amet pharetra diam luctus hendrerit. Aliquam lacus ex, euismod sed suscipit quis, iaculis in diam. Vivamus non quam arcu. Aliquam dictum ante non ante vehicula, ut hendrerit sapien accumsan.
	   </p>
		</div>
	</div>
	)
  }