import React, { createContext, useState, useContext } from 'react';

// Create the context
const LoaderContext = createContext();

// Create a provider component
export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

// Custom hook to use the loader context
export const useLoader = () => useContext(LoaderContext);
