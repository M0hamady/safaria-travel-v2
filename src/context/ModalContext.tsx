// src/context/ModalContext.tsx
import React, { createContext, useContext, useState } from "react";

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  message?: string; // Optional message if no children are provided.
  children?: React.ReactNode;
  button1Label: string;
  button2Label: string;
  button1Action: () => void;
  button2Action: () => void;
}

interface ModalContextType {
  modal: ModalProps | null;
  openModal: (modalProps: Omit<ModalProps, "isOpen">) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState<ModalProps | null>(null);

  const openModal = (modalProps: Omit<ModalProps, "isOpen">) => {
    setModal({ isOpen: true, ...modalProps });
  };

  const closeModal = () => {
    setModal(null);
  };

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
