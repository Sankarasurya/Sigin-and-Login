import React from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
function Welcome() {
  const [auth,setAuth] = useState(false)
  const [message,setMessage] = useState('')
  const [name,SetName] = useState('')
  axios.defaults.withCredentials=true;
  useEffect(()=>{
    axios.get('http://localhost:3000/welcome')
    .then(res=>{
      if(res.data.Status==='Success'){
        setAuth(true)
        SetName(res.data.name)
      }
      else{
        setAuth(false)
        setMessage(res.data.Error)
      }
    })
    .catch(err=>console.log(err))
  },[])
const handleDelete = () => {
  axios.get('http://localhost:3000/logout', { withCredentials: true })
    .then(res => {
      location.reload();
    })
    .catch(err => console.log(err));
};

  return (
<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
  {
    auth ? (
      <div style={{ textAlign: 'center', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: 'green', marginBottom: '20px' }}>
          You are authorized {name}
        </h2>
       <Link to={'/login'}><button style={{backgroundColor: 'blue',color: 'white',padding: '10px 20px',border: 'none',borderRadius: '4px',cursor: 'pointer'}}onClick={handleDelete}>
          Logout
        </button></Link>
      </div>
    ) : (
      <div style={{ textAlign: 'center', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h3 style={{ color: 'red', marginBottom: '10px' }}>{message}</h3>
        <h3 style={{ marginBottom: '20px' }}>Login now</h3>
        <Link to={'/login'}>
          <button style={{backgroundColor: 'blue',color: 'white',padding: '10px 20px',border: 'none',borderRadius: '4px',cursor: 'pointer'}}>
            Login
          </button>
        </Link>
      </div>
    )
  }
</div>

  )
}

export default Welcome