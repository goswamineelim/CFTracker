
import Homepage from '@/Pages/Homepage.jsx'
import LoginPage from '@/Pages/Loginpage.jsx'
import { Route ,Routes,useLocation } from "react-router-dom"
import { useAuthStore } from '@/store/useAuthStore.js'
import { useEffect } from 'react';
import SignUppage from "@/Pages/SignUppage.jsx"
import VerifyOtp from "@/Pages/Verifyotppage.jsx"
import { Toaster } from 'react-hot-toast';

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
        <Route path="/signup" element={<SignUppage/>}/>
        <Route path="/verify-otp" element={<VerifyOtp />} />
      </Routes>

      <Toaster />
    </>
  )
}