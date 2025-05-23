import React  from 'react'
import type { ReactNode } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { useModal } from '../../contexts/ModalContext'

interface ModalWrapperProps {
  modalName: string
  children: ReactNode
}

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  modalName,
  children,
}) => {
  const { closeModal, isModalOpen } = useModal()

  const handleOverlayClick = () => {
    closeModal(modalName)
  }

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isModalOpen(modalName) && (
          <motion.div
            className={`fixed  top-0 left-0 w-screen h-screen ${modalName !== 'joinGameModal' && 'bg-black/50 backdrop-blur-md'}  flex items-center justify-center z-30`}
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={handleOverlayClick}
          >
            <motion.div
              className="w-full h-full md:w-2xl relative flex flex-col justify-center items-center overflow-hidden"
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={handleModalClick}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
