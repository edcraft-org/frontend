import type React from "react"
import { useEffect } from "react"
import { useBeforeUnload, useBlocker } from "react-router-dom"
import { useNavigationWarning } from "../../../context/NavigationWarningContext"

export const NavigationWarning: React.FC = () => {
  const { bypassWarning } = useNavigationWarning();

  useBeforeUnload((event) => {
    if (!bypassWarning) {
      event.preventDefault()
      return "Changes you made may not be saved. Are you sure you want to leave?"
    }
  })

  const blocker = useBlocker(({ currentLocation, nextLocation }) =>
    !bypassWarning && currentLocation.pathname !== nextLocation.pathname
  )

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