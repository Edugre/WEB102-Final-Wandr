import { Outlet } from 'react-router-dom'
import AuthNavbar from './AuthNavbar'

const AuthLayout = () => {
  return (
    <div className='app-container'>
      <AuthNavbar />
      <div className='auth-background'>
        <div className='auth-content'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout