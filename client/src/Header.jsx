import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from './context'

function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext)

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include'
    })
    .then(res => {
      res.json().then(userInfo => {
        setUserInfo(userInfo)
      })
    }).catch(err => console.log(err))
  }, [])

  async function logout() {
    fetch('http://localhost:4000/logout', {
      method: 'POST',
      credentials: 'include'
    });

    setUserInfo(null)
  }

  const username = userInfo?.username; 

  return (
    <>
        <header>
          <Link to={'/'} style={{fontSize: "1.5rem", fontWeight: "bold"}}>Medium</Link>
          <nav>
            {username && (
              <>
                <Link to='/create'>Create new post</Link>
                <Link onClick={logout}>Logout</Link>
              </>
            )}
            {! username && (
              <>
                <Link to={'/login'} style={{fontSize: "1.5 rem"}}>LogIn</Link>
                <Link to={'/register'} style={{fontSize: "1.5 rem"}}>Register</Link>
              </>
            )}
          </nav>
        </header>
    </>
  )
}

export default Header