import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function ChatLayout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default ChatLayout;
