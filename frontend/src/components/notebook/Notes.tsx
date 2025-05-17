import React, {useState} from 'react';
import {motion} from 'framer-motion'
import { useGameStore } from '../../store';
import { getNarrative } from '../../api';

interface NotesNavProps {
  selectedTab?: 'case' | 'suspects';
  setSelectedTab: (tab: 'case' | 'suspects') => void;
}


const NotesNav: React.FC<NotesNavProps> = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="w-full h-16 flex gap-4 font-bold justify-center items-center">
      <button onClick={() => setSelectedTab('case')}>Case</button>
      <button onClick={() => setSelectedTab('suspects')}>Suspects</button>
    </div>
  )
}



const SuspectNotes: React.FC<{ suspect: any }> = ({ suspect }) => {

  console.log("suspect notes: ", suspect)
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{suspect.name}</h2>
      <p><strong>Age:</strong> {suspect.age}</p>

      <div className="relative w-24 h-24 overflow-hidden border-1 border-black">
        <img
          src="/images/gameBoy/walls.png"
          className="w-24 h-24  absolute"
        ></img>
        <img
          src={suspect.mugshot}
          className="w-24 h-24 object-contain absolute"
        />
      </div>

      <p><strong>Alibi:</strong> {suspect.alibi}</p>
      {/* Add more fields as needed */}
    </div>
  )
}


interface SuspectsNavProps {
  selectedTab: string | null;
  setSelectedTab: (id: string) => void;
}

const SuspectsNav: React.FC<SuspectsNavProps> = ({ selectedTab, setSelectedTab }) => {
  const suspects = useGameStore((state) => state.suspects)

  return (
    <div className="w-full flex justify-center items-center gap-2">
      {suspects.map((suspect) => (
        <button
          key={suspect.id}
          onClick={() => setSelectedTab(suspect.id)}
          className={`px-4 py-2 border rounded ${
            selectedTab === suspect.id ? 'bg-black text-white' : 'bg-white text-black'
          }`}
        >
          {suspect.name}
        </button>
      ))}
    </div>
  )
}



const SuspectsTab: React.FC = () => {
  const suspects = useGameStore((state) => state.suspects)
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>('suspect_1');
  
  const selectedSuspect = suspects.find(s => s.id === selectedSuspectId);
  
  return (
    <motion.div>
      <SuspectsNav
        setSelectedTab={setSelectedSuspectId}
        selectedTab={selectedSuspectId}
        />
      {selectedSuspect && <SuspectNotes suspect={selectedSuspect} />}
    </motion.div>
  )
}

const Case:React.FC = () => {
  const narrative = useGameStore((state) => state.narrative)
  return (
    <div className="w-full flex justify-center items-center gap-2 p-2">
      <p>
        {narrative.detective_briefing}
     </p>
  </div>
  )
}

export const Notes: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'case' | 'suspects' | undefined>('case');

  return (
    <motion.div className="text-black-custom h-full w-full flex flex-col">
      <h1 className="font-bold uppercase text-center text-2xl">Notes</h1>

      <div id="content" className="w-full flex-grow overflow-auto">
        {selectedTab === 'suspects' ? (
          <SuspectsTab></SuspectsTab>
        ) : (
          <Case></Case>
        )}
      </div>

      <NotesNav selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
    </motion.div>
  );
};

