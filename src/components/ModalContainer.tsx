// src/components/ModalComponent.tsx
import React from 'react';
import { useModal } from '../context/ModalContext';

export const ModalComponent = () => {
  const { modal, modalRef, closeModal } = useModal();

if (!modal || !modal.isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      aria-modal="true"
      role="dialog"
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={closeModal}
        >x</div>

        {/* Modal container */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Modal content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {modal.title && (
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {modal.title}
              </h3>
            )}
            {modal.message && <p className="mt-2 text-sm text-gray-500">{modal.message}</p>}
            {modal.children}
          </div>
          
          {/* Modal buttons */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={modal.button1Action}
            >
              {modal.button1Label}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={closeModal}
            >
              {modal.button2Label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};