import React, { createContext, useContext, useState } from 'react';

interface NavigationWarningContextType {
  bypassWarning: boolean;
  setBypassWarning: (bypass: boolean) => void;
}

const NavigationWarningContext = createContext<NavigationWarningContextType>({
  bypassWarning: false,
  setBypassWarning: () => {},
});

export const NavigationWarningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bypassWarning, setBypassWarning] = useState(false);

  return (
    <NavigationWarningContext.Provider value={{ bypassWarning, setBypassWarning }}>
      {children}
    </NavigationWarningContext.Provider>
  );
};

export const useNavigationWarning = () => useContext(NavigationWarningContext);