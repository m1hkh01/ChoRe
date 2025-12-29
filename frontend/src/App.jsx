import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Login } from './components/Login'
import Register from './components/Register'
import Header from './components/Header'
import Home from './components/Home'

function App() {

  return (
    <>
      <div className='container'>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register/>}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
