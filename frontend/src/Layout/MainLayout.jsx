import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "@/assets/MainLayout.css";

function MainLayout() {
  return (
    <div className="layout-wrapper">
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="layout-content">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default MainLayout;