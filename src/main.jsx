import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PostCreate from './components/PostCreate.jsx'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import AuthLayout from './components/AuthLayout.jsx'
import Dashboard from './components/Dashboard.jsx'
import PostScreen from './components/PostScreen.jsx'
import PostUpdate from './components/PostUpdate.jsx'
import Settings from './components/Settings.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>
        <Route path='/app' element={<App />} >
          <Route path='dashboard' element={<Dashboard />}/>
          <Route path='post/create' element={<PostCreate />}/>
          <Route path='post/:id' element={<PostScreen />}/>
          <Route path='post/:id/update' element={<PostUpdate />}/>
          <Route path='settings' element={<Settings />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
