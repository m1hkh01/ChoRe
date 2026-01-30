import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "@/assets/MainLayout.css";

function MainLayout() {
    return (
        <>
            <Header />
           <main className="mb-2">
                <Outlet />
            </main>
             <Footer />
        </>
    );
}

export default MainLayout;
