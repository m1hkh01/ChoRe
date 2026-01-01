import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Login } from './components/Login'
import Register from './components/Register'
import Header from './components/Header'
import Home from './components/Home'
import ProtectedRoute from "./routes/ProtectedRoute";
import CreatePost from "./components/CreatePost";
import MainLayout from './Layout/MainLayout'
import AdminLayout from './Layout/AdminLayout'
import RequireRole from './routes/RequireRole'
import PostManager from './components/AdminComponents/PostManager'

function App() {

  return (
    <>
      {/* <Header></Header> */}
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/post/create" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }>
          </Route>
        </Route>
        <Route path='/dashboard' element={
          <RequireRole roles={["Admin","Censor"]}>
            <AdminLayout />
          </RequireRole>
        }>
          <Route path="post-manager" element={<PostManager/>}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
