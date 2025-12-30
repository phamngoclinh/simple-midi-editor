'use client';

import React, { createContext, ReactNode, useContext, useReducer } from 'react';
import initialModalState from './initialModalState';
import modalReducer from './modalReducer';
import { ModalAction, ModalState } from './modalTypes';

interface ModalContextType {
  state: ModalState;
  dispatch: React.Dispatch<ModalAction>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(modalReducer, initialModalState);

  return <ModalContext.Provider value={{ state, dispatch }}>{children}</ModalContext.Provider>;
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal phải được sử dụng trong ModalProvider');
  }
  return context;
};

export const useModalState = () => {
  const { state } = useModal();
  return state;
};

export const useModalDispatch = () => {
  const { dispatch } = useModal();
  return dispatch;
};

export const useModalSelector = <TSelected extends any>(
  selector: (state: ModalState) => TSelected,
): TSelected => {
  const state = useModalState();
  return selector(state);
};
