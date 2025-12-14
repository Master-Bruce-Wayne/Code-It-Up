import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Route, Routes, BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// contexts
import { UserProvider } from './context/User.jsx'

// pages
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Problemset from './pages/Problemset.jsx'
import Contests from './pages/Contests.jsx'

// components
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problemset" element={<Problemset />} />
          <Route path="/contests" element={<Contests />} />
        </Routes>
        <Footer />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
