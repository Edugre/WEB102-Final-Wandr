import { Link, useNavigate } from "react-router-dom"
import { createClient } from "@supabase/supabase-js"

const Login = () => {
  const navigate = useNavigate()
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const login_user = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (error) {
        alert('Login failed: ' + error.message)
      } else {
        console.log('Login successful!', data)
        navigate('/app/dashboard')
      }
    } catch (error) {
      console.log(error)
      alert('An error occurred during login')
    }
  }

  return (
    <div className="login-container">
      <h1>Join fellow travelers, share your adventures, and discover hidden gems around the globe.</h1>
      <h1>Sign in and start exploring today!</h1>
      <div className="login-card">
        <form className="login-form" onSubmit={login_user}>
          <input type="email" name="email" id="email" placeholder="Email..." className="form-input" />
          <input type="password" name="password" id="password" placeholder="Password..." className="form-input" />
          <div className="login-buttons">
            <button type="submit" className="form-button">Login</button>
            <Link to='/register'><button type="button" className="form-button">Register Now!</button></Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login