import { Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './Layout'
import Index from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'
import UserContextProvider from './context'
import CreatePost from './pages/CreatePost'
import PostPage from './pages/PostPage'
import EditPost from './pages/EditPost'

function App() {

  return (
    <>
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Index />}/>
          <Route path='/login' element={<Login />}/> 
          <Route path='/register' element={<Register />}/> 
          <Route path='/create' element={<CreatePost />}/> 
          <Route path='/post/:id' element={<PostPage />}/> 
          <Route path='/edit/:id' element={<EditPost />}/> 
        </Route>
      </Routes>
    </UserContextProvider>
    </>
  )
}

export default App
