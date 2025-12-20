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
import ContestPage from './pages/ContestPage.jsx'
import ProblemPage from './pages/ProblemPage.jsx'

// admin pages
import AddContest from './pages/admin/AddContest.jsx'
import AddProblems from './pages/admin/AddProblems.jsx'

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
          <Route path="/contest/:contestCode" element={<ContestPage />} />
          <Route path="/problemset/problem/:probCode" element={<ProblemPage />} />
          <Route path="/contest/:contestCode/problem/:probCode" element={<ProblemPage />} />

          <Route path="/admin/addContest" element={<AddContest />} />
          <Route path="/admin/addProblem" element={<AddProblems/> } />
        </Routes>
        <Footer />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
)
