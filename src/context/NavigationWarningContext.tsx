import React, { createContext, useContext, useRef, useState } from 'react';

interface NavigationWarningContextType {
  bypassWarning: boolean;
  setBypassWarning: (bypass: boolean) => void;
  bypassWarningRef: React.MutableRefObject<boolean>;
}

const NavigationWarningContext = createContext<NavigationWarningContextType>({
  bypassWarning: false,
  setBypassWarning: () => {},
  bypassWarningRef: { current: false },
});

export const NavigationWarningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bypassWarning, setBypassWarningState] = useState(false);
  const bypassWarningRef = useRef(false);

  const setBypassWarning = (value: boolean) => {
    bypassWarningRef.current = value;
    setBypassWarningState(value);
  };

  return (
    <NavigationWarningContext.Provider value={{ bypassWarning, setBypassWarning, bypassWarningRef }}>
      {children}
    </NavigationWarningContext.Provider>
  );
};

export const useNavigationWarning = () => useContext(NavigationWarningContext);
