import React, { createContext, useContext, useState } from "react"

const CsrfContext = createContext()

export function CsrfProvider({ children }) {
  const [csrfToken, setCsrfToken] = useState("")

  return (
    <CsrfContext.Provider value={{ csrfToken, setCsrfToken }}>
      {children}
    </CsrfContext.Provider>
  )
}

export function useCsrf() {
  return useContext(CsrfContext)
}
