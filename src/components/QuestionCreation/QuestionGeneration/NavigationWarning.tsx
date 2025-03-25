import type React from "react"

import { useEffect } from "react"
import { useBeforeUnload, useBlocker } from "react-router-dom"

export const NavigationWarning: React.FC = () => {
  useBeforeUnload((event) => {
    event.preventDefault()
    return "Changes you made may not be saved. Are you sure you want to leave?"
  })

  const blocker = useBlocker(({ currentLocation, nextLocation }) => currentLocation.pathname !== nextLocation.pathname)

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmed = window.confirm("Changes you made may not be saved. Are you sure you want to leave?")
      if (confirmed) {
        blocker.proceed()
      } else {
        blocker.reset()
      }
    }
  }, [blocker])

  return null
}

