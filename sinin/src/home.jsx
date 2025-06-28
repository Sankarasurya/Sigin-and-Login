import React from 'react'
import {Link} from 'react-router-dom'
function Home() {
  return (
    <div>
        <h1>Home</h1>
        <Link to={'/login'}><button style={{backgroundColor:'blue',color:'white'}}>Login</button></Link>
    </div>
  )
}

export default Home