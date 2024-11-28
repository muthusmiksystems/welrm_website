import React, { createContext, useState } from 'react';

// Create the context
export const TabContext = createContext();

// Create a provider component
export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('Dashboard'); // Default tab

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};
