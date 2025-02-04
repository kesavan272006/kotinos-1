import React, { createContext, useContext, useState } from 'react';

const RequestContext = createContext();

export const useRequestContext = () => {
  return useContext(RequestContext);
};

export const RequestProvider = ({ children }) => {
  const [oppUserId, setOppUserId] = useState(null);

  const setOppId = (userId) => {
    setOppUserId(userId);
  };

  return (
    <RequestContext.Provider value={{ oppUserId, setOppId }}>
      {children}
    </RequestContext.Provider>
  );
};
