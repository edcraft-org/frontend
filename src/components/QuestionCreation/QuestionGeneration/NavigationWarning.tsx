import React, { useEffect } from "react"
import { useBeforeUnload, useBlocker } from "react-router-dom"
import { useNavigationWarning } from "../../../context/NavigationWarningContext"

export const NavigationWarning: React.FC = () => {
  const { bypassWarningRef } = useNavigationWarning();

  useBeforeUnload((event) => {
    if (!bypassWarningRef.current) {
      event.preventDefault();
      return "Changes you made may not be saved. Are you sure you want to leave?";
    }
  });

  const blocker = useBlocker(({ currentLocation, nextLocation }) =>
    !bypassWarningRef.current && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmed = window.confirm("Changes you made may not be saved. Are you sure you want to leave?");
      if (confirmed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  return null;
};
