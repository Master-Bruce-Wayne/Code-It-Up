import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Route, Routes, BrowserRouter, useLocation} from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// contexts
import { UserProvider } from './context/User.jsx'
import { SubmissionProvider } from './context/Submission.jsx'

// pages
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Problemset from './pages/Problemset.jsx'
import Contests from './pages/Contests.jsx'
import ContestPage from './pages/ContestPage.jsx'
import ProblemPage from './pages/ProblemPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SubmissionsPage from './pages/SubmissionsPage.jsx'

// admin pages
import AddContest from './pages/admin/AddContest.jsx'
import AddProblems from './pages/admin/AddProblems.jsx'

// components
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

function SubmissionRouter() {
  const location = useLocation();
  if(location.pathname.includes("/submissions")) {
    return <SubmissionsPage />;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <SubmissionProvider>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />

            {/* auth routes  */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:username" element={<ProfilePage />} />

            {/* problemset routes  */}
            <Route path="/problemset" element={<Problemset />} />
            <Route path="/problemset/problem/:probCode" element={<ProblemPage />} />

            {/* contest routes  */}
            <Route path="/contests" element={<Contests />} />
            <Route path="/contest/:contestCode" element={<ContestPage />} />
            <Route path="/contest/:contestCode/problem/:probCode" element={<ProblemPage />} />

            {/* admin only routes  */}
            <Route path="/admin/addContest" element={<AddContest />} />
            <Route path="/admin/addProblem" element={<AddProblems/> } />

            {/* submissions routes  */}
            <Route path="/contest/:contestCode/submissions/my" element={<SubmissionsPage />} />
            <Route path="/problemset/problem/:probCode/submissions/my" element={<SubmissionsPage />} />
            <Route path="/contest/:contestCode/problem/:probCode/submissions/my"  element={<SubmissionsPage />} />
            {/* <Route path="*" element={<SubmissionRouter />} />  */}

          </Routes>
          {/* <Footer /> */}
        </SubmissionProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
)
