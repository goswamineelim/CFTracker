
import Homepage from './Pages/Homepage/Homepage.jsx'
import LoginPage from './Pages/Loginpage/Loginpage.jsx'
import { Route ,Routes,useLocation } from "react-router-dom"
import { useAuthStore } from './store/useAuthStore.js'
import { useEffect } from 'react';
export default function App() {
  const {authUser, getUser} = useAuthStore();

  useEffect(() => {
    getUser(); // Get user on app load
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={authUser !== null ? <Homepage/> : <LoginPage />}/>
        <Route path="/login" element={<LoginPage/>}/>
      </Routes>
    </>
  )
}