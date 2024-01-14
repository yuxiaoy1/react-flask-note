import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import ApiProvider from './contexts/ApiProvider'
import UserProvider from './contexts/UserProvider'
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <UserProvider>
          <Header />
          <Routes>
            <Route
              path='/register'
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path='/login'
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path='*'
              element={
                <PrivateRoute>
                  <Routes>
                    <Route path='/' element={<MainPage />} />
                    <Route path='*' element={<Navigate to='/' />} />
                  </Routes>
                </PrivateRoute>
              }
            />
          </Routes>
        </UserProvider>
      </ApiProvider>
    </BrowserRouter>
  )
}
