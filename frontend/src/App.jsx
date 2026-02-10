import "./App.css";
import { Routes, Route } from "react-router-dom";

/* ================= PAGES ================= */
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import ServicePackage from "./pages/ServicePackage/ServicePackage";
import ServicePackageManager from "./pages/ServicePackage/ServicePackageManager";
import TransactionPayPage from "./pages/Pay/TransactionPayPage";
import ChatPage from "./pages/ChatPage";
import TransactionManagementPage from "./pages/TransactionManagementPage";

/* ================= LAYOUTS ================= */
import MainLayout from "./Layout/MainLayout";
import AdminLayout from "./Layout/AdminLayout";
import CensorLayout from "./Layout/CensorLayout";
import ChatLayout from "./Layout/ChatLayout";

/* ================= ROUTE GUARDS ================= */
import ProtectedRoute from "./routes/ProtectedRoute";
import RequireRole from "./routes/RequireRole";

/* ================= ADMIN COMPONENTS ================= */
import UserManager from "./pages/AdminComponents/UserManager";
import SubscriptionPlanManager from "./pages/AdminComponents/SubscriptionPlanManager";
import UserSubscriptionManager from "./pages/AdminComponents/UserSubscriptionManager";
import PostManager from "./pages/AdminComponents/PostManager";
import BrandManager from "./pages/AdminComponents/BrandManager";
import CategoryManager from "./pages/AdminComponents/CategoryManager";
import BrandCategoryManager from "./pages/AdminComponents/BrandCategoryManager";
import SpecificationManager from "./pages/AdminComponents/SpecificationManager";
import EscrowTransactions from "./pages/AdminComponents/EscrowTransactions";
import Profile from "./pages/Profile";
import ProfilePage from "./pages/Profile";

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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pay/transaction/:transactionId"
          element={
            <ProtectedRoute>
              <TransactionPayPage />
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
          path="/user-transactions"
          element={
            <ProtectedRoute>
              <TransactionManagementPage />
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

      {/* ================= CHAT ================= */}
      <Route path="/chat" element={<ChatLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <ChatPage />
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
        <Route
          path="post-manager"
          element={
            <RequireRole roles={["Admin", "Censor"]}>
              <PostManager />
            </RequireRole>
          }
        />

        <Route
          path="transaction-manager"
          element={
            <RequireRole roles={["Admin", "Censor"]}>
              <EscrowTransactions />
            </RequireRole>
          }
        />

        <Route
          path="sub-manager"
          element={
            <RequireRole roles={["Admin"]}>
              <SubscriptionPlanManager />
            </RequireRole>
          }
        />

        <Route
          path="user-subscriptions"
          element={
            <RequireRole roles={["Admin"]}>
              <UserSubscriptionManager />
            </RequireRole>
          }
        />

        <Route
          path="user-manager"
          element={
            <RequireRole roles={["Admin"]}>
              <UserManager />
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
  );
}

export default App;
