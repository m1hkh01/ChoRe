import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Login } from './components/Login'
import Header from './components/Header'

function App() {

  return (
    <>
      <div className='container'>
        <Header></Header>
        <Routes>
          {/* <Route path="/" element={<Home/>}></Route> */}
          <Route path="/login" element={<Login />}></Route>
          {/* <Route path="/" element={<Home/>}></Route> */}
        </Routes>
      </div>
    </>
  )
}

export default App
