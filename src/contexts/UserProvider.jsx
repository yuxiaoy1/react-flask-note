import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useApi } from './ApiProvider'

let UserContext = createContext()

export default function UserProvider({ children }) {
  let [user, setUser] = useState()
  let api = useApi()

  useEffect(() => {
    ;(async () => {
      if (api.isAuthenticated()) {
        let response = await api.get('/me')
        setUser(response.ok ? response.body : null)
      } else {
        setUser(null)
      }
    })()
  }, [api, setUser])

  let login = useCallback(async (username, password) => {
    let response = await api.login(username, password)
    if (response === 'ok') {
      let data = await api.get('/me')
      setUser(data.ok ? data.body : null)
    }
    return response
  })

  let logout = useCallback(async function () {
    await api.logout()
    setUser(null)
  })

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
