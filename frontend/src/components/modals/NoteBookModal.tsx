import React from 'react';

import { ModalWrapper } from '../modals/ModalWrapper';
import { useModal } from '../../contexts/ModalContext';
import { Notes } from '../notebook/Notes';

export const NoteBookMoadal: React.FC = () => {
  const { isModalOpen } = useModal();

  return (
    <ModalWrapper modalName="noteBook">
      {isModalOpen('noteBook') && (
        <div className="relative text-black-custom w-full h-full md:h-2xl md:max-h-[70%] overflow-hidden flex flex-col grow-1 items-center bg-white">
          <Notes></Notes>
        </div>
      )}
    </ModalWrapper>
  );
};
