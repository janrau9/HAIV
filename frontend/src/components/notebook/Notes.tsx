import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store'
import { Meter } from '../suspect/Meter'
import { Case } from './Case' // Import from separate component if it exists
import { SuspectsTab as MainSuspectsTab } from './SuspectNotes' // Import from separate component if it exists

interface NotesNavProps {
  selectedTab?: 'case' | 'suspects' | 'clues'
  setSelectedTab: (tab: 'case' | 'suspects' | 'clues') => void
}

// Enhanced NotesNav with notebook styling
const NotesNav: React.FC<NotesNavProps> = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="w-full flex font-bold">
      <button
        onClick={() => setSelectedTab('case')}
        className={`${selectedTab !== 'case' ? 'bg-notebook-darker' : 'bg-notebook-bg'} px-4 py-2 rounded-t-lg border-1 border-b-0`}
      >
        Case
      </button>
      <button
        onClick={() => setSelectedTab('suspects')}
        className={`${selectedTab !== 'suspects' ? 'bg-notebook-darker' : 'bg-notebook-bg'} px-4 py-2 rounded-t-lg border-1 border-b-0`}
      >
        Suspects
      </button>
      <button
        onClick={() => setSelectedTab('clues')}
        className={`${selectedTab !== 'clues' ? 'bg-notebook-darker' : 'bg-notebook-bg'} px-4 py-2 rounded-t-lg border-1 border-b-0`}
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
          <img src="/images/gameBoy/walls.png" className="w-24 h-24 absolute" />
          <img
            src={suspect.mugshot}
            className="w-24 h-24 object-contain absolute"
          />
        </div>

        <div className="flex-1">
          <p>
            <strong>Age:</strong> {suspect.age}
          </p>
          <p>
            <strong>Personality:</strong> {suspect.personality}
          </p>
          <p>
            <strong>Occupation:</strong>{' '}
            {(suspect as any).occupation || 'Unknown'}
          </p>
          <p>
            <strong>Alibi:</strong> {suspect.alibi}
          </p>

          {(suspect as any).relationship_to_victim && (
            <p>
              <strong>Relation to victim:</strong>{' '}
              {(suspect as any).relationship_to_victim}
            </p>
          )}

          {/* Add both meters */}
          <div className="mt-2">
            <Meter
              label="SUSPICION"
              value={suspect.suspicion}
              colorScheme="suspicion"
            />

            <Meter label="TRUST" value={suspect.trust} colorScheme="trust" />
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

interface SuspectsNavProps {
  selectedTab: string | null
  setSelectedTab: (id: string) => void
}

const SuspectsNav: React.FC<SuspectsNavProps> = ({
  selectedTab,
  setSelectedTab,
}) => {
  const suspects = useGameStore((state) => state.suspects)

  return (
    <div className="w-full flex justify-center items-center">
      {suspects.map((suspect) => (
        <button
          key={suspect.id}
          onClick={() => setSelectedTab(suspect.id)}
          className={`px-4 py-2 text-xs rounded-t-lg border-1 border-b-0 ${
            selectedTab === suspect.id ? 'bg-notebook-bg' : 'bg-notebook-darker'
          }`}
        >
          {suspect.name}
        </button>
      ))}
    </div>
  )
}

// Our custom SuspectsTab that includes SuspectNotes
const OurSuspectsTab: React.FC<{ selectedSuspectId?: string | null }> = ({
  selectedSuspectId,
}) => {
  const suspects = useGameStore((state) => state.suspects)
  const [localSelectedSuspectId, setLocalSelectedSuspectId] = useState<
    string | null
  >(selectedSuspectId || 'Suspect_1')

  // Update local state if prop changes
  useEffect(() => {
    if (selectedSuspectId) {
      setLocalSelectedSuspectId(selectedSuspectId)
    }
  }, [selectedSuspectId])

  const selectedSuspect = suspects.find((s) => s.id === localSelectedSuspectId)

  return (
    <motion.div>
      {!selectedSuspectId && (
        <SuspectsNav
          setSelectedTab={setLocalSelectedSuspectId}
          selectedTab={localSelectedSuspectId}
        />
      )}
      {selectedSuspect && <SuspectNotes suspect={selectedSuspect} />}
    </motion.div>
  )
}

// New CluesTab component to display discovered clues
const CluesTab: React.FC = () => {
  const clues = useGameStore((state) => state.clues)
  const playerNotebook = useGameStore((state) => state.playerNotebook)

  // Filter to only show discovered clues
  const discoveredClues = Object.values(clues).filter((clue) => clue.discovered)

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Discovered Clues</h2>

      {discoveredClues.length === 0 ? (
        <p className="italic text-gray-600">No clues discovered yet...</p>
      ) : (
        <ul className="list-disc pl-5">
          {discoveredClues.map((clue) => (
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
  )
}

// Enhanced Case component to display crime scene details
const OurCase: React.FC = () => {
  // This would ideally be populated from the narrative created by the backend
  const [caseDetails, setCaseDetails] = useState({
    detective_briefing: 'The case details are still being loaded...',
    scene: {
      when: 'Unknown',
      where: 'Unknown',
      victim: {
        name: 'Unknown',
        age: 0,
        description: 'Details still emerging',
      },
    },
  })

  // This would be populated when the narrative is loaded from the backend
  useEffect(() => {
    // Mock data for now - this would be replaced with actual narrative data
    setTimeout(() => {
      setCaseDetails({
        detective_briefing:
          'A body was discovered in the research laboratory. The victim, Dr. Marcus Wells, appears to have been poisoned. Four suspects were present at the facility that night: John Doe, the security guard; Jane Smith, a lab technician; Alice Johnson, a company executive; and Bob Brown, an IT specialist.',
        scene: {
          when: 'May 16, 2025, approximately 11:30 PM. Heavy rain.',
          where: 'BioGen Research Facility, Lab Room 237',
          victim: {
            name: 'Dr. Marcus Wells',
            age: 52,
            description:
              'Lead researcher, found slumped over his desk with no visible injuries. Preliminary toxicology report suggests poison.',
          },
        },
      })
    }, 1000)
  }, [])

  return (
    <div className="w-full p-4 text-black">
      <h2 className="text-xl font-bold mb-4">Case Summary</h2>

      <div className="mb-6 p-3 border border-gray-300 bg-gray-50">
        <p className="italic">{caseDetails.detective_briefing}</p>
      </div>

      <h3 className="font-bold mt-4">Crime Scene Details</h3>
      <div className="ml-4 mt-2">
        <p>
          <strong>When:</strong> {caseDetails.scene.when}
        </p>
        <p>
          <strong>Where:</strong> {caseDetails.scene.where}
        </p>
      </div>

      <h3 className="font-bold mt-4">Victim Information</h3>
      <div className="ml-4 mt-2">
        <p>
          <strong>Name:</strong> {caseDetails.scene.victim.name}
        </p>
        <p>
          <strong>Age:</strong> {caseDetails.scene.victim.age}
        </p>
        <p>
          <strong>Details:</strong> {caseDetails.scene.victim.description}
        </p>
      </div>
    </div>
  )
}

export const Notes: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'case' | 'suspects' | 'clues'>(
    'case',
  )
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(
    'Suspect_1',
  )

  return (
    <div className="w-full h-full">
      <div className="my-0 flex items-end justify-end">
        <NotesNav selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        {selectedTab === 'suspects' && (
          <SuspectsNav
            setSelectedTab={setSelectedSuspectId}
            selectedTab={selectedSuspectId}
          />
        )}
      </div>

      <motion.div className="notebook relative text-black my-0 bg-notebook-bg rounded-sm h-full w-full flex flex-col">
        <div id="content" className="w-full flex-grow overflow-auto">
          {selectedTab === 'suspects' ? (
            // Try to use imported SuspectsTab if it exists, otherwise use our custom one
            typeof MainSuspectsTab !== 'undefined' ? (
              <MainSuspectsTab selectedSuspectId={selectedSuspectId} />
            ) : (
              <OurSuspectsTab selectedSuspectId={selectedSuspectId} />
            )
          ) : selectedTab === 'clues' ? (
            <CluesTab />
          ) : // Try to use imported Case if it exists, otherwise use our custom one
          typeof Case !== 'undefined' ? (
            <Case />
          ) : (
            <OurCase />
          )}
        </div>
      </motion.div>
    </div>
  )
}
