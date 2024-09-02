import React, { createContext, useState, useContext } from 'react';

// Create the context with default values
const BooleanContext = createContext();

// Custom hook to use the BooleanContext
export const useBoolean = () => useContext(BooleanContext);

// Provider component
export const BooleanProvider = ({ children }) => {
  const [isTrue, setIsTrue] = useState(false); // Default value is false

  // Toggle function
  const toggleBoolean = (value) => {
    setIsTrue(value);
  };

  return (
    <BooleanContext.Provider value={{ isTrue, toggleBoolean }}>
      {children}
    </BooleanContext.Provider>
  );
};
