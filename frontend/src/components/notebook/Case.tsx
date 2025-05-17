import { CasePolaroid } from "./Polaroid"
import { useGameStore } from "../../store"

export const Case: React.FC = () => {
	const narrative = useGameStore((state) => state.narrative)

	return (
		<div className="w-full flex justify-center items-center gap-2 p-4 flex-col">
			<h1 className="font-bold uppercase text-center text-2xl text-red-400">Casefile</h1>

			<div>
				<div className="float-left mr-4 mb-4 ">
					<CasePolaroid imgUrl={'/images/mansion.png'}></CasePolaroid>
				</div>
				<p>
					{narrative.detective_briefing}
				</p>
			</div>
		</div>
	)
}