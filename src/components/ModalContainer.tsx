// src/components/ModalContainer.tsx
import React from "react";
import { useModal } from "../context/ModalContext";

const ModalContainer: React.FC = () => {
  const { modal, closeModal } = useModal();

  if (!modal || !modal.isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={closeModal}
      ></div>
      {/* Modal Content */}
      <div className="bg-white rounded shadow-md z-10 w-11/12 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h2 className="text-xl font-bold">
            {modal.title || "Modal"}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        {/* Body */}
        <div className="px-4 py-4">
          {modal.children ? (
            modal.children
          ) : (
            <p>{modal.message}</p>
          )}
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-4 py-2 space-x-4">
          <button
            onClick={() => {
              modal.button1Action();
              closeModal();
            }}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
          >
            {modal.button1Label}
          </button>
          <button
            onClick={() => {
              modal.button2Action();
              closeModal();
            }}
            className="px-4 py-2 bg-secondary text-gray-700 rounded hover:bg-secondary"
          >
            {modal.button2Label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalContainer;
