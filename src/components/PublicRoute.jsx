import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserProvider'

export default function PublicRoute({ children }) {
  let { user } = useUser()

  if (user === undefined) {
    return null
  } else if (user) {
    return <Navigate to='/' />
  } else {
    return children
  }
}
