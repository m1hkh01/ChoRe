import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Login } from './components/Login'
import Register from './components/Register'
import Header from './components/Header'
import Home from './components/Home'
import ProtectedRoute from "./routes/ProtectedRoute";
import CreatePost from "./components/CreatePost";

function App() {

  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/post/create" element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }></Route>
      </Routes>
    </>
  )
}

export default App
