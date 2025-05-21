import { motion } from 'framer-motion'
import type { SuspectSummary } from '../../../../types/types'
import { useGameStore } from '../../store/gameStore'
import { Polaroid } from './Polaroid'

export const SuspectNotes: React.FC<{ suspect: SuspectSummary }> = ({ suspect }) => {
  console.log('suspect notes: ', suspect)
  return (
    <div className="p-4 flex-grow">
      <div className="flex gap-2">
        <Polaroid suspect={suspect}></Polaroid>

        <div>
          <h2 className="text-xl font-bold">Name: {suspect.name}</h2>
          <p>
            <strong>Age:</strong> {suspect.age}
          </p>
          <p>
            <strong>Alibi:</strong> {suspect.alibi}
					</p>
					<p>
           <strong>Known Interactions:</strong>{" "}
           {suspect.known_interactions == null
             ? "Unknown"
             : Array.isArray(suspect.known_interactions)
             ? suspect.known_interactions.join(", ")
             : suspect.known_interactions.split(";").join(", ")}
          </p>
        </div>
        <div className="relative w-24 h-24 min-w-24 min-h-24 overflow-hidden">
          <img
            src="/images/suspects/fingerPrint.png"
            className="w-24 h-24 object-contain absolute"
          />
        </div>
        {/* NOTES*/}
      </div>

      <div>
        <h1 className="font-bold uppercase text-center text-2xl underline">
          NOTES
        </h1>
        <ul>
          {suspect.revealedClues?.map((note: string, index: number) => (
            <li key={index} className="list-disc">
              <span className="font-bold">{note}</span>
            </li>
          ))}
        </ul>
         <h2 className="font-semibold mt-4">Conversation History</h2>
        <ul className="pl-5 list-disc">
          {suspect.memory?.history?.length ? (
            suspect.memory.history.map((msg, idx) => (
              <li key={`hist-${idx}`} className="mb-1">
                <strong>
                  {msg.role === 'user' ? 'You' : suspect.name}:
                </strong>{' '}
                {msg.content}
              </li>
            ))
          ) : (
            <li className="italic text-gray-600">No conversation yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export const SuspectsTab: React.FC<{ selectedSuspectId: string }> = ({
  selectedSuspectId,
}) => {
  const suspects = useGameStore((state) => state.suspects)

  const selectedSuspect = suspects.find((s) => s.id === selectedSuspectId)

  return (
    <motion.div className="flex grow w-full flex-col p-2">
      <h1 className="font-bold uppercase text-center text-2xl text-red-400">
        Suspect
      </h1>

      {selectedSuspect && <SuspectNotes suspect={selectedSuspect} />}
    </motion.div>
  )
}
