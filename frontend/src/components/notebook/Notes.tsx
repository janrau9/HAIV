import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import { useGameStore } from '../../store';
import { Meter } from '../suspect/Meter';

interface NotesNavProps {
  selectedTab?: 'case' | 'suspects' | 'clues';
  setSelectedTab: (tab: 'case' | 'suspects' | 'clues') => void;
}

// Enhanced NotesNav with additional "Clues" tab
const NotesNav: React.FC<NotesNavProps> = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="w-full h-16 flex gap-4 font-bold justify-center items-center">
      <button
        onClick={() => setSelectedTab('case')}
        className={`px-3 py-1 ${selectedTab === 'case' ? 'bg-green-900 text-white' : ''}`}
      >
        Case
      </button>
      <button
        onClick={() => setSelectedTab('suspects')}
        className={`px-3 py-1 ${selectedTab === 'suspects' ? 'bg-green-900 text-white' : ''}`}
      >
        Suspects
      </button>
      <button
        onClick={() => setSelectedTab('clues')}
        className={`px-3 py-1 ${selectedTab === 'clues' ? 'bg-green-900 text-white' : ''}`}
      >
        Clues
      </button>
    </div>
  )
}

// Enhanced SuspectNotes with more information from the narrative
const SuspectNotes: React.FC<{ suspect: any }> = ({ suspect }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{suspect.name}</h2>

      <div className="flex items-start gap-4">
        <div className="relative w-24 h-24 overflow-hidden border-1 border-black">
          <img
            src="/images/gameBoy/walls.png"
            className="w-24 h-24 absolute"
          />
          <img
            src={suspect.mugshot}
            className="w-24 h-24 object-contain absolute"
          />
        </div>

        <div className="flex-1">
          <p><strong>Age:</strong> {suspect.age}</p>
          <p><strong>Personality:</strong> {suspect.personality}</p>
          <p><strong>Occupation:</strong> {(suspect as any).occupation || 'Unknown'}</p>
          <p><strong>Alibi:</strong> {suspect.alibi}</p>

          {(suspect as any).relationship_to_victim && (
            <p><strong>Relation to victim:</strong> {(suspect as any).relationship_to_victim}</p>
          )}

          {/* Add both meters */}
          <div className="mt-2">
            <Meter
              label="SUSPICION"
              value={suspect.suspicion}
              colorScheme="suspicion"
            />

            <Meter
              label="TRUST"
              value={suspect.trust}
              colorScheme="trust"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-bold">Notes:</h3>
        <ul className="list-disc pl-5 mt-2">
          {suspect.characteristics.map((trait: string, index: number) => (
            <li key={index}>{trait}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
}
}

interface SuspectsNavProps {
  selectedTab: string | null;
  setSelectedTab: (id: string) => void;
}

const SuspectsNav: React.FC<SuspectsNavProps> = ({ selectedTab, setSelectedTab }) => {
  const suspects = useGameStore((state) => state.suspects)

  return (
    <div className="w-full flex justify-center items-center gap-2 overflow-x-auto p-2">
      {suspects.map((suspect) => (
        <button
          key={suspect.id}
          onClick={() => setSelectedTab(suspect.id)}
          className={`px-4 py-2 border rounded whitespace-nowrap ${selectedTab === suspect.id ? 'bg-green-900 text-white' : 'bg-white text-black'
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

// New CluesTab component to display discovered clues
const CluesTab: React.FC = () => {
  const clues = useGameStore((state) => state.clues);
  const playerNotebook = useGameStore((state) => state.playerNotebook);

  // Filter to only show discovered clues
  const discoveredClues = Object.values(clues).filter(clue => clue.discovered);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Discovered Clues</h2>

      {discoveredClues.length === 0 ? (
        <p className="italic text-gray-600">No clues discovered yet...</p>
      ) : (
        <ul className="list-disc pl-5">
          {discoveredClues.map(clue => (
            <li key={clue.id} className="mb-2">
              <p>{clue.content}</p>
              <p className="text-xs italic">Found in: {clue.foundInSceneId}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <h3 className="font-bold">Personal Notes</h3>
        {playerNotebook.length === 0 ? (
          <p className="italic text-gray-600 mt-2">No notes taken yet...</p>
        ) : (
          <ul className="list-disc pl-5 mt-2">
            {playerNotebook.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Enhanced Case component to display crime scene details
const Case: React.FC = () => {
  // This would ideally be populated from the narrative created by the backend
  const [caseDetails, setCaseDetails] = useState({
    detective_briefing: "The case details are still being loaded...",
    scene: {
      when: "Unknown",
      where: "Unknown",
      victim: {
        name: "Unknown",
        age: 0,
        description: "Details still emerging"
      }
    }
  });

  // This would be populated when the narrative is loaded from the backend
  useEffect(() => {
    // Mock data for now - this would be replaced with actual narrative data
    setTimeout(() => {
      setCaseDetails({
        detective_briefing: "A body was discovered in the research laboratory. The victim, Dr. Marcus Wells, appears to have been poisoned. Four suspects were present at the facility that night: John Doe, the security guard; Jane Smith, a lab technician; Alice Johnson, a company executive; and Bob Brown, an IT specialist.",
        scene: {
          when: "May 16, 2025, approximately 11:30 PM. Heavy rain.",
          where: "BioGen Research Facility, Lab Room 237",
          victim: {
            name: "Dr. Marcus Wells",
            age: 52,
            description: "Lead researcher, found slumped over his desk with no visible injuries. Preliminary toxicology report suggests poison."
          }
        }
      });
    }, 1000);
  }, []);

  return (
    <div className="w-full p-4 text-green-900">
      <h2 className="text-xl font-bold mb-4">Case Summary</h2>

      <div className="mb-6 p-3 border border-green-700 bg-green-50">
        <p className="italic">{caseDetails.detective_briefing}</p>
      </div>

      <h3 className="font-bold mt-4">Crime Scene Details</h3>
      <div className="ml-4 mt-2">
        <p><strong>When:</strong> {caseDetails.scene.when}</p>
        <p><strong>Where:</strong> {caseDetails.scene.where}</p>
      </div>

      <h3 className="font-bold mt-4">Victim Information</h3>
      <div className="ml-4 mt-2">
        <p><strong>Name:</strong> {caseDetails.scene.victim.name}</p>
        <p><strong>Age:</strong> {caseDetails.scene.victim.age}</p>
        <p><strong>Details:</strong> {caseDetails.scene.victim.description}</p>
      </div>
    </div>
  );
};

export const Notes: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'case' | 'suspects' | 'clues'>('case');

  return (
    <motion.div className="text-black-custom h-full w-full flex flex-col">
      <h1 className="font-bold uppercase text-center text-2xl text-green-900 pt-3">Investigation Notes</h1>

      <div className="w-full flex-grow overflow-auto">
        {selectedTab === 'suspects' ? (
          <SuspectsTab />
        ) : selectedTab === 'clues' ? (
          <CluesTab />
        ) : (
          <Case />
        )}
      </div>

      <NotesNav selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
    </motion.div>
  );
};
