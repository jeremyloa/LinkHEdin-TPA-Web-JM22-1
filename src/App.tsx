import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Activate from './pages/Activate';
import { UserContext } from './contexts/UserContext';
import Front from './pages/Front';
import In from './pages/in/In';
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot1 from './pages/Forgot1';
import Forgot2 from './pages/Forgot2';
import { GoogleOAuthProvider } from '@react-oauth/google'
import About from './pages/About';
import Accessibility from './pages/Accessibility';
import UserAgreement from './pages/UserAgreement';
import PrivacyPolicy from './pages/PrivacyPolicy';
function App() {
  //if user exists in localstorage, set it
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)
  

  return (
    <BrowserRouter>
    {/* add context providers*/}
      <UserContext.Provider value={{ user, setUser }}>
          <GoogleOAuthProvider clientId='914306519488-kanb7dje9ov9upcf43uuah4efphkncbn.apps.googleusercontent.com'>
            <Routes>
              <Route path='/' element={<Front/>}/>
              <Route path='/about' element={<About/>}/>
              <Route path='/accessibility' element={<Accessibility/>}/>
              <Route path='/user-agreement' element={<UserAgreement/>}/>
              <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
              <Route path='/register' element={<Register/>}/>
              <Route path='/login' element={<div id='DivSignIn'><Login/></div>}/>
              <Route path='/forgot' element={<Forgot1/>}/>
              <Route path='/reset/:id' element={<Forgot2/>}/>
              <Route path='/activate/:id' element={<Activate/>}/>
              <Route path="/in/*" element={<In/>}/>
            </Routes>
          </GoogleOAuthProvider>
      </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App
