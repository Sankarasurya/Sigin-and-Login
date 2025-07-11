import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios'
import Signup from './sinup';
function Login() {
    const [formes, setFormes] = useState({
        username: '',
        password: '',
        role:''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormes({ ...formes, [name]: value });
    };
    const navigate=useNavigate()
    axios.defaults.withCredentials = true;
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formes);
        axios.post('http://localhost:3000/login', formes, { withCredentials: true })
    .then(res => {
      console.log(res);
      if (res.data.Status === "Success") {
        alert("Login successful!");

        if (res.data.role === 'worker') {
          navigate('/worker');
        } else if (res.data.role === 'admin') {
          navigate('/owner');
        }
      } else {
        alert(res.data.Error);
      }
    })
    .catch(err => {
      console.log(err);
      alert("An error occurred during login. Please try again.");
    });
};

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                width: '300px'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formes.username}
                            onChange={handleChange}
                            required
                            style={{
                              width: '100%',
                                padding: '8px',
                                borderRadius: '5px',
                                border: '1px solid #ccc'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formes.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '5px',
                                border: '1px solid #ccc'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Role</label>
                    <select
                        name="role"
                        value={formes.role}
                        onChange={handleChange}
                        required
                        style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                        }}
                    >
                        <option value="">Select a password</option>
                        <option value="admin">admin</option>
                        <option value="worker">worker</option>
                    </select>
                    </div>

                    <button type="submit" style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                        Login
                    </button>
                    <div>
                   <Link to='/register' ><p style={{textAlign:'center'}}>did not heve account ? create Account</p></Link>
                   </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
