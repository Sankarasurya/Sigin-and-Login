import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sinup from './sinup'
import Login from './login'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './home'
import Welcome from './Welcome'
import Owner from './Owner'
import Worker from './Worker'
import ProtectedRoute from './ProtectedRoute'

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/register' element={<Sinup/>}/>
              <Route path='/welcome' element={<Welcome/>}/>
              <Route path="/owner" element={
              <ProtectedRoute allowedRole="admin">
                <Owner/>
              </ProtectedRoute>
              }/>
              <Route path="/worker" element={
              <ProtectedRoute allowedRole="worker">
                <Worker/>
              </ProtectedRoute>
              } />


          </Routes>
        </BrowserRouter>

      </div>
    </>
  )
}

export default App
