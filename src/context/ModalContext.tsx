// src/context/ModalContext.tsx
import React, { createContext, useContext, useState, useRef, useEffect } from "react";

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  message?: string; // Optional message if no children are provided.
  children?: React.ReactNode;
  button1Label: string;
  button2Label: string;
  button1Action: () => void;
  button2Action: () => void;
    scrollToModal?: boolean; // New prop to control scrolling behavior

}

interface ModalContextType {
  modal: ModalProps | null;
  modalRef: React.RefObject<HTMLDivElement | null>; // Updated this line
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
  const modalRef = useRef<HTMLDivElement | null>(null); // Updated this line

  const openModal = (modalProps: Omit<ModalProps, "isOpen">) => {
   
    setModal({ isOpen: true, ...modalProps });
    // Scroll to modal after state update
   
  };

  const closeModal = () => {
    setModal(null);
  };
  // Auto-scroll effect
useEffect(() => {
  if (modal?.isOpen && modal.scrollToModal) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}, [modal]);

  return (
    <ModalContext.Provider value={{ modal, modalRef, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};