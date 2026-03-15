import "./App.css";
import { Routes, Route } from "react-router-dom";

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
import CensorLayout from "./Layout/CensorLayout";
import ChatLayout from "./Layout/ChatLayout";
import SearchPage from "@/pages/SearchPage";
import Favorites from "@/pages/Favorites";

/* ================= ROUTE GUARDS ================= */
import ProtectedRoute from "./routes/ProtectedRoute";
import RequireRole from "./routes/RequireRole";

/* ================= ADMIN COMPONENTS ================= */
import UserManager from "./pages/AdminPages/UserManager";
import SubscriptionPlanManager from "./pages/AdminPages/SubscriptionPlanManager";
import UserSubscriptionManager from "./pages/AdminPages/UserSubscriptionManager";
import PostManager from "./pages/AdminPages/PostManager";
import BrandManager from "./pages/AdminPages/BrandManager";
import CategoryManager from "./pages/AdminPages/CategoryManager";
import BrandCategoryManager from "./pages/AdminPages/BrandCategoryManager";
import SpecificationManager from "./pages/AdminPages/SpecificationManager";
import EscrowTransactions from "./pages/AdminPages/EscrowTransactions";
import Profile from "./pages/Profile";
import ProfilePage from "./pages/Profile";
import { useAuthStore } from "./store/auth";
import { SignalRProvider } from "./signalr/SignalRContext";

function App() {
  const { token } = useAuthStore();
  return (
    <SignalRProvider token={token}>
      <Routes>
        {/* ================= USER ================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route element={<HelpLayout />}>

            <Route path="/about" element={<About />} />

            <Route path="/privacy" element={<Privacy />} />

            <Route path="/terms" element={<Terms />} />

            <Route path="/contact" element={<Contact />} />

            <Route path="/helpcenter" element={<Shipping />} />

            <Route path="/payment" element={<Payment />} />

            <Route path="/ds" element={<Warranty />} />

          </Route>

          <Route
            path="/post/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          {/* edit post – only available to logged in users and typically used by the profile page */}
          <Route
            path="/profile/edit/:postId"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sreach"
            element={
              <SearchPage>
                <SearchPage />
              </SearchPage>
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
            path="/pay/package/:orderId"
            element={
              <ProtectedRoute>
                <PackagePayPage />
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
    </SignalRProvider>
  );
}

export default App;
