import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store'
import { div } from 'framer-motion/client'
import { Polaroid, CasePolaroid } from './Polaroid'
import { Case } from './Case'
import { SuspectsTab } from './SuspectNotes'

interface NotesNavProps {
  selectedTab?: 'case' | 'suspects'
  setSelectedTab: (tab: 'case' | 'suspects') => void
}

interface SuspectsNavProps {
  selectedTab: string | null
  setSelectedTab: (id: string) => void
}

const NotesNav: React.FC<NotesNavProps> = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="w-full flex font-bold ">
      <button
        className={`${selectedTab !== 'case' ? 'bg-notebook-darker' : 'bg-notebook-bg'} px-4 py-2 rounded-t-lg border-1 border-b-0`}
        onClick={() => setSelectedTab('case')}
      >
        Case
      </button>
      <button
        className={`${selectedTab !== 'suspects' ? 'bg-notebook-darker' : 'bg-notebook-bg'} px-4 py-2 rounded-t-lg border-1 border-b-0`}
        onClick={() => setSelectedTab('suspects')}
      >
        Suspects
      </button>
    </div>
  )
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
          className={`px-4 py-2 text-xs rounded-t-lg border-1 border-b-0 whitespace-nowrap flex-shrink-0 ${
            selectedTab === suspect.id ? 'bg-notebook-bg' : 'bg-notebook-darker'
          }`}
        >
          {suspect.name}
        </button>
      ))}
    </div>
  )
}

export const Notes: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<
    'case' | 'suspects' | undefined
  >('case')
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(
    'suspect_1',
  )

  return (
    <div className="w-full h-full">
      <div className="my-0 flex items-end">
        <NotesNav selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        {selectedTab === 'suspects' && (
          <SuspectsNav
            setSelectedTab={setSelectedSuspectId}
            selectedTab={selectedSuspectId}
          />
        )}
      </div>
      <motion.div className="notebook relative text-black-custom my-0  bg-notebook-bg rounded-sm h-full w-full flex flex-col ">
        <div id="content" className="w-full flex-grow overflow-auto">
          {selectedTab === 'suspects' ? (
            <SuspectsTab selectedSuspectId={selectedSuspectId}></SuspectsTab>
          ) : (
            <Case></Case>
          )}
        </div>
      </motion.div>
    </div>
  )
}
