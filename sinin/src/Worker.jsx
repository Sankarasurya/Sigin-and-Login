import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
function Worker() {
  const [auth, setAuth] = useState(false)
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  axios.defaults.withCredentials = true;
  const navigate = useNavigate()
  useEffect(() => {
    axios.get('http://localhost:3000/welcome')
      .then(res => {
        console.log(res)
        if (res.data.Status === 'Success') {
          setAuth(true)
          setName(res.data.name)
          setRole(res.data.role)
        } 
        else {
          setAuth(false)
          setMessage(res.data.Error)
        }
      })
      .catch(err => console.log(err))
  }, [])

  const handleLogout = () => {
    axios.get('http://localhost:3000/logout', { withCredentials: true })
      .then(res => {
        window.location.reload();
      })
      .catch(err => console.log(err));
  };
  return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          {
            auth ? (
              <div style={{ textAlign: 'center', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <h2 style={{ color: 'green', marginBottom: '20px' }}>
                  Welcome to:{role} page
                </h2>
                <h2 style={{ color: 'green', marginBottom: '20px' }}>
                  You are authorized: {name} ({role})
                </h2>
                <button onClick={handleLogout} style={{
                  backgroundColor: 'blue',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ color: 'red', marginBottom: '10px' }}>{message}</h3>
                <h3 style={{ marginBottom: '20px' }}>Login now</h3>
                <Link to={'/login'}>
                  <button style={{
                    backgroundColor: 'blue',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>
                    Login
                  </button>
                </Link>
              </div>
            )
          }
        </div>
  )
}

export default Worker