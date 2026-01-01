import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function MainLayout() {
    return (
        <>
            <Header></Header>
            <Outlet></Outlet>
        </>
    )
}
export default MainLayout;