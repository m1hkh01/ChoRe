import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "@/assets/MainLayout.css";
import FloatingContact from "../components/FloatingContact";
import ServicePackage from "../pages/ServicePackage/ServicePackage";

function MainLayout() {
  return (
    <div className="layout-wrapper">
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="layout-content">
        <Outlet />
        <FloatingContact />
        {/* <ServicePackage /> */}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default MainLayout;