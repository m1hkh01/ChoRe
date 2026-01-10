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
import BrandManager from './components/AdminComponents/BrandManager.jsx'
import CategoryManager from './components/AdminComponents/CategoryManager.jsx'
import BrandCategoryManager from './components/AdminComponents/BrandCategoryManager.jsx'
import SpecificationManager from './components/AdminComponents/SpecificationManager.jsx'
import PostDetail from './components/PostDetail.jsx'
import ServicePackage from './components/ServicePackage/ServicePackage.jsx'
import ServicePackageManager from './components/ServicePackage/ServicePackageManager.jsx'

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
        <Route
          path="/service-package"
          element={
            <ProtectedRoute>
              <ServicePackage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/service-package-manager"
          element={
            <ProtectedRoute>
              <ServicePackageManager />
            </ProtectedRoute>
          }
        />
        <Route path="/posts/:id" element={<PostDetail />} />
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
        <Route path="post-manager"
          element={
            <RequireRole roles={["Admin","Censor"]}>
              <PostManager />
            </RequireRole>
          }
        />
        <Route
          path="brand-manager"
          element={
            <RequireRole roles={["Admin"]}>
              <BrandManager />
            </RequireRole>
          }
        />
        <Route
          path="category-manager"
          element={
            <RequireRole roles={["Admin"]}>
              <CategoryManager />
            </RequireRole>
          }
        />
        <Route
          path="brand-category-manager"
          element={
            <RequireRole roles={["Admin"]}>
              <BrandCategoryManager />
            </RequireRole>
          }
        />
        <Route
          path="specification-manager"
          element={
            <RequireRole roles={["Admin"]}>
              <SpecificationManager />
            </RequireRole>
          }
        />
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
        <Route path="post-censor" element={<PostManager />} />
      </Route>

    </Routes>
  )
}

export default App
