import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { supabase } from './utils/supabase'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const query = formData.get('search')
    setSearchQuery(query)
    navigate(`/app/dashboard?search=${query}`)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className='app-container'>
      <div className='navbar'>
        <Link to='/app/dashboard'><h1>Wandr</h1></Link>
        <form className='search-form' onSubmit={handleSearch}>
          <input type='search' name='search' id='search' placeholder='Search...' aria-label='Search'/>
        </form>
        <div className='links'>
          <Link to='/app/dashboard'>Home</Link>
          <Link to='/app/post/create'>Create new post</Link>
          <Link to='/app/settings'>Settings</Link>
          <a onClick={handleLogout}>Log Out</a>
        </div>
      </div>
      <div className='main-content'>
        <Outlet />
      </div>
    </div>
  )
}

export default App
