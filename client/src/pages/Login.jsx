import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [validate, setValidate] = useState("")

    const { setUserInfo } = useContext(UserContext);

    async function logIn(e) {
        e.preventDefault();
        const response = await fetch('http://localhost:4000/login', {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })

        if (response.ok) {
            response.json().then((userInfo) => {setUserInfo(userInfo)})
            setRedirect(true)
        } else {
            setValidate("Invalid Credentials")
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

  return (
    <form className='login' onSubmit={logIn}>
        <h1>Login</h1>
        <input  type="text" 
                placeholder='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}/>
        <input  type="password" 
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
        <button type='submit'>Login</button>
        <p>{validate}</p>
    </form>
  )
}

export default Login