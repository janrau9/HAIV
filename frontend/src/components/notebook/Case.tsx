import { useGameStore } from '../../store/gameStore'
import { CasePolaroid } from './Polaroid'

export const Case: React.FC = () => {
  const narrative = useGameStore((state) => state.narrative)

  return (
    <div className="w-full flex pb-6 justify-center items-center gap-2 p-4 flex-col">
      <h1 className="font-bold uppercase text-center text-2xl text-red-400">
        Victim
      </h1>

      <div className="flex border-b-1 py-2">
        <div className="">
          <CasePolaroid imgUrl={'/images/mansion.png'}></CasePolaroid>
        </div>
        <div className="my-2 p-2 ">
          <p className="font-bold underline text-lg">
            <strong>Name:</strong> {narrative.scene.victim.name}
          </p>
          <p className="font-bold underline text-lg">
            <strong>Age:</strong> {narrative.scene.victim.age}
          </p>
          <p className="font-bold  text-lg">
            <strong>When:</strong> {narrative.scene.when}
          </p>
          <p className="font-bold  text-lg">
            {' '}
            <strong>Where:</strong>
            {narrative.scene.where}
          </p>
        </div>
      </div>
      <p className="mb-6">{narrative.detective_briefing}</p>
    </div>
  )
}
