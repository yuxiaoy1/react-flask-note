import { useUser } from '../contexts/UserProvider'

export default function Header() {
  let { user, logout } = useUser()

  return (
    <>
      <h2>Hello Flask and React!</h2>
      {user && (
        <p>
          Logged as <b>{user.name}</b>.{' '}
          <a style={{ cursor: 'pointer' }} onClick={logout}>
            Logout
          </a>
        </p>
      )}
    </>
  )
}
