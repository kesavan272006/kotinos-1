import React, { createContext, useState, useContext } from 'react';

const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const [requestSenderId, setRequestSenderId] = useState(null);
  const [oppositeId, setOppositeId] = useState(''); 

  return (
    <RequestContext.Provider value={{ requestSenderId, setRequestSenderId, oppositeId, setOppositeId }}>
      {children}
    </RequestContext.Provider>
  );
};

// Create a custom hook to use the context
export const useRequestContext = () => {
  return useContext(RequestContext);
};
