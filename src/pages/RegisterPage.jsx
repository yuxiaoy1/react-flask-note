import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import { useApi } from '../contexts/ApiProvider'

export default function RegisterPage() {
  let [formErrors, setFormErrors] = useState({})
  let usernameRef = useRef()
  let passwordRef = useRef()
  let password2Ref = useRef()
  let api = useApi()
  let navigate = useNavigate()

  useEffect(() => {
    usernameRef.current.focus()
  }, [])

  async function onSubmit(event) {
    event.preventDefault()

    let username = usernameRef.current.value
    let password = passwordRef.current.value
    let password2 = password2Ref.current.value
    let errors = {}

    if (!username) {
      errors.username = 'Username must not be empty.'
    }

    if (!password) {
      errors.password = 'Password must not be empty.'
    }

    if (password !== password2) {
      errors.password2 = "Password doesn't match."
    }

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    let response = await api.post('/users', { name: username, password })
    if (response.ok) {
      setFormErrors({})
      navigate('/login')
    } else {
      setFormErrors(response.body.errors.json)
    }
  }

  return (
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
      <InputField
        name='password2'
        label='Enter password again:'
        type='password'
        fieldRef={password2Ref}
        error={formErrors.password2}
      />
      <button type='submit' className='primary'>
        Register
      </button>
    </form>
  )
}
