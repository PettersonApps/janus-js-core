import React, { createContext, useContext, useReducer } from 'react';
import reducer from './reducer';

const initialState = {
  janusInstance: null,
  chatroomId: 0,
  opaqueId: '',
  pubId: 0,
  pubPvtId: 0,
  room: 0,
  streamToken: 'd0e267603026c5798b94ce5c32ced550aa0c13e2',
};

export const StreamContext = createContext({
  state: initialState,
  dispatch: () => null,
});

export const useStreamContext = () => useContext(StreamContext);

export const StreamStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };

  return <StreamContext.Provider value={value}>{children}</StreamContext.Provider>;
};
