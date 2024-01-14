import { createContext, useContext, useMemo } from 'react'
import ApiClient from '../ApiClient'

let ApiContext = createContext()

export default function ApiProvider({ children }) {
  let api = useMemo(() => new ApiClient())
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}

export function useApi() {
  return useContext(ApiContext)
}
