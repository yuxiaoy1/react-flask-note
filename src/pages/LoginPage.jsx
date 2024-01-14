import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import { useUser } from '../contexts/UserProvider'

export default function LoginPage() {
  let [formErrors, setFormErrors] = useState({})
  let usernameRef = useRef()
  let passwordRef = useRef()
  let { login } = useUser()
  let navigate = useNavigate()

  useEffect(() => {
    usernameRef.current.focus()
  }, [])

  async function onSubmit(event) {
    event.preventDefault()

    let username = usernameRef.current.value
    let password = passwordRef.current.value
    let errors = {}

    if (!username) {
      errors.username = 'Username must not be empty.'
    }

    if (!password) {
      errors.password = 'Password must not be empty.'
    }

    setFormErrors(errors)

    if (Object.keys(errors).length > 0) return

    let response = await login(username, password)

    if (response === 'ok') {
      navigate('/')
    } else if (response === 'fail') {
      setFormErrors({
        password: 'Invalid username or password, please try again.',
      })
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <InputField
          name='username'
          label='Username:'
          fieldRef={usernameRef}
          error={formErrors.username}
        />
        <InputField
          name='password'
          label='Password:'
          type='password'
          fieldRef={passwordRef}
          error={formErrors.password}
        />
        <button type='submit' className='primary'>
          Login
        </button>
      </form>
      <p>
        Don't have an account? <NavLink to='/register'>Register</NavLink> here.
      </p>
    </div>
  )
}
