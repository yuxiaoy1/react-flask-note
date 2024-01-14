import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserProvider'

export default function PrivateRoute({ children }) {
  let { user } = useUser()
  let location = useLocation()

  if (user === undefined) {
    return null
  } else if (user) {
    return children
  } else {
    const url = location.pathname + location.search + location.hash
    return <Navigate to='/login' state={{ next: url }} />
  }
}
