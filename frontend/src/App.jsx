import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

/* ================= PAGES ================= */
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import EditPost from "./pages/EditPost";
import ServicePackage from "./pages/ServicePackage/ServicePackage";
import ServicePackageManager from "./pages/ServicePackage/ServicePackageManager";
import TransactionPayPage from "./pages/Pay/TransactionPayPage";
import PackagePayPage from "./pages/Pay/PackagePayPage";
import ChatPage from "./pages/ChatPage";
import TransactionManagementPage from "./pages/TransactionManagementPage";
import HelpLayout from "./Layout/HelpLayout";
import About from "./pages/Help/About";
import Privacy from "./pages/Help/Privacy";
import Terms from "./pages/Help/Terms";
import Contact from "./pages/Help/Contact";
import Shipping from "./pages/Help/Helpcenter";
import Payment from "./pages/Help/Payment";
import Warranty from "./pages/Help/Ds";

/* ================= LAYOUTS ================= */
import MainLayout from "./Layout/MainLayout";
import AdminLayout from "./Layout/AdminLayout";
import ChatLayout from "./Layout/ChatLayout";
import SearchPage from "@/pages/SearchPage";
import Favorites from "@/pages/Favorites";

/* ================= ROUTE GUARDS ================= */
import ProtectedRoute from "./routes/ProtectedRoute";
import RequireRole from "./routes/RequireRole";

/* ================= ADMIN PAGES ================= */
import Admindashboard from "./pages/AdminPages/Admindashboard";
import UserManager from "./pages/AdminPages/UserManager";
import SubscriptionPlanManager from "./pages/AdminPages/SubscriptionPlanManager";
import UserSubscriptionManager from "./pages/AdminPages/UserSubscriptionManager";
import PostManager from "./pages/AdminPages/PostManager";
import BrandManager from "./pages/AdminPages/BrandManager";
import CategoryManager from "./pages/AdminPages/CategoryManager";
import BrandCategoryManager from "./pages/AdminPages/BrandCategoryManager";
import SpecificationManager from "./pages/AdminPages/SpecificationManager";
import EscrowTransactions from "./pages/AdminPages/EscrowTransactions";

/* ================= CENSOR PAGES ================= */
import PostCensor from "./pages/CensorPages/PostCensor";
// PostPreviewModal là modal component — không route, chỉ dùng bên trong PostCensor

import ProfilePage from "./pages/Profile";
import { useAuthStore } from "./store/auth";
import { SignalRProvider } from "./signalr/SignalRContext";
import PostPayPage from "./pages/Pay/PostPayPage";
import { useEffect } from "react";
import api from "./api";

function App() {
  const { token } = useAuthStore();
  const setToken  = useAuthStore(state => state.setToken);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.post("/account/refresh-token");
        setToken(res.data.token);
      } catch {
        console.log("No session");
      }
    };
    initAuth();
  }, []);

  return (
    <SignalRProvider token={token}>
      <Routes>

        {/* ═══════════════════════════════
            USER + CENSOR — MainLayout
        ═══════════════════════════════ */}
        <Route element={<MainLayout />}>
          <Route path="/"                element={<Home />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/search"          element={<SearchPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/favorites"       element={<Favorites />} />
          <Route path="/posts/:id"       element={<PostDetail />} />

          <Route element={<HelpLayout />}>
            <Route path="/about"      element={<About />} />
            <Route path="/privacy"    element={<Privacy />} />
            <Route path="/terms"      element={<Terms />} />
            <Route path="/contact"    element={<Contact />} />
            <Route path="/helpcenter" element={<Shipping />} />
            <Route path="/payment"    element={<Payment />} />
            <Route path="/ds"         element={<Warranty />} />
          </Route>

          <Route path="/post/create"          element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/profile/edit/:postId" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
          <Route path="/profile"              element={<ProfilePage />} />
          <Route path="/profile/:userId"      element={<ProfilePage />} />

          <Route path="/pay/transaction/:transactionId" element={<ProtectedRoute><TransactionPayPage /></ProtectedRoute>} />
          <Route path="/pay/post/:postId"               element={<ProtectedRoute><PostPayPage /></ProtectedRoute>} />
          <Route path="/pay/package/:orderId"           element={<ProtectedRoute><PackagePayPage /></ProtectedRoute>} />
          <Route path="/service-package"                element={<ProtectedRoute><ServicePackage /></ProtectedRoute>} />
          <Route path="/user-transactions"              element={<ProtectedRoute><TransactionManagementPage /></ProtectedRoute>} />
          <Route path="/service-package-manager"        element={<ProtectedRoute><ServicePackageManager /></ProtectedRoute>} />

          {/* Censor dùng chung MainLayout */}
          <Route
            path="/censor/post-censor"
            element={<RequireRole roles={["Censor"]}><PostCensor /></RequireRole>}
          />
        </Route>

        {/* ═══════════════════════════════
            CHAT
        ═══════════════════════════════ */}
        <Route path="/chat" element={<ChatLayout />}>
          <Route index element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        </Route>

        {/* ═══════════════════════════════
            ADMIN
        ═══════════════════════════════ */}
        <Route
          path="/admin"
          element={<RequireRole roles={["Admin"]}><AdminLayout /></RequireRole>}
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard"              element={<Admindashboard />} />
          <Route path="post-manager"           element={<PostManager />} />
          <Route path="transaction-manager"    element={<EscrowTransactions />} />
          <Route path="sub-manager"            element={<SubscriptionPlanManager />} />
          <Route path="user-subscriptions"     element={<UserSubscriptionManager />} />
          <Route path="user-manager"           element={<UserManager />} />
          <Route path="brand-manager"          element={<BrandManager />} />
          <Route path="category-manager"       element={<CategoryManager />} />
          <Route path="brand-category-manager" element={<BrandCategoryManager />} />
          <Route path="specification-manager"  element={<SpecificationManager />} />
        </Route>

      </Routes>
    </SignalRProvider>
  );
}

export default App;