
import Homepage from './Pages/Homepage/Homepage.jsx'
import LoginPage from './Pages/Loginpage/Loginpage.jsx'
import { Route ,Routes,useLocation } from "react-router-dom"
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
      </Routes>
    </>
  )
}