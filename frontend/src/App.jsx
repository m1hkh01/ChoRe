import './App.css'
import { Routes, Route } from 'react-router-dom'

import { Login } from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import CreatePost from "./components/CreatePost"

import MainLayout from './Layout/MainLayout'
import AdminLayout from './Layout/AdminLayout'
import CensorLayout from './Layout/CensorLayout'

import ProtectedRoute from "./routes/ProtectedRoute"
import RequireRole from './routes/RequireRole'

import PostManager from './components/AdminComponents/PostManager'
import PostCensor from './components/CensorComponents/PostCensor'

function App() {
  return (
    <Routes>

      {/* ================= USER ================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/post/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <RequireRole roles={["Admin"]}>
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route path="post-manager" element={<PostManager />} />
      </Route>

      {/* ================= CENSOR ================= */}
      <Route
        path="/censor"
        element={
          <RequireRole roles={["Censor"]}>
            <CensorLayout />
          </RequireRole>
        }
      >
        <Route path="post-censor" element={<PostCensor />} />
      </Route>

    </Routes>
  )
}

export default App
