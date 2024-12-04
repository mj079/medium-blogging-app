import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validate, setValidate] = useState('');
    const [redirect, setRedirect] = useState(false)

    async function register(e)  {
        e.preventDefault();
        const response = await fetch('http://localhost:4000/register', {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        });
        if(response.ok) {
            setRedirect(true)
        }else {
            setValidate("username already taken, try another one")
        }
    }

    if(redirect) {
        return <Navigate to={'/login'} />
    }

  return (
    <form className='login' onSubmit={register}>
        <h1>Register</h1>
        <input  type="text" 
                placeholder='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}/>
        <input  type="password" 
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
        <button type='submit'>Register</button>
        <p>{validate}</p>
    </form>
  )
}

export default Register