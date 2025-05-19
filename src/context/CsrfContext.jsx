import React, { createContext, useContext, useState, useEffect } from "react"

const CsrfContext = createContext()

export function CsrfProvider({ children }) {
  // Initialize state from localStorage (or fallback to empty string)
  const [csrfToken, setCsrfToken] = useState(() => {
    return localStorage.getItem("csrfToken") || ""
  })

  // Whenever csrfToken changes, update localStorage accordingly
  useEffect(() => {
    if (csrfToken) {
      localStorage.setItem("csrfToken", csrfToken)
    } else {
      localStorage.removeItem("csrfToken")
    }
  }, [csrfToken])

  return (
    <CsrfContext.Provider value={{ csrfToken, setCsrfToken }}>
      {children}
    </CsrfContext.Provider>
  )
}

export function useCsrf() {
  return useContext(CsrfContext)
}
