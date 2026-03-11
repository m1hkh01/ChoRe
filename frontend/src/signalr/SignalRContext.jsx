import { createContext, use, useContext, useEffect, useRef } from "react";
import { createConnection } from "./signalr";
import { useAuthStore } from "../store/auth";
import api from "../api";

const SignalRContext = createContext(null);

export const SignalRProvider = ({ children }) => {

    const token = useAuthStore(state => state.token);
    const connectionRef = useRef(null);
    if (!token) {
        const initAuth = async () => {
            try {
                const res = await api.post("/account/refresh-token");
                const { token } = res.data;

                useAuthStore.getState().setToken(token);
            } catch (err) {
                console.log("Not logged in", err);
            }
        };
        initAuth();
    }
    useEffect(() => {
        console.log("SignalRProvider - token: ", token);
        if (!token) return;

        // nếu đã có connection rồi thì không tạo nữa
        if (connectionRef.current) return;

        const connection = createConnection(token);
        connectionRef.current = connection;

        const startConnection = async () => {
            try {
                await connection.start();
                console.log("SignalR Connected ✅");
            } catch (err) {
                console.error("SignalR connect error:", err);
            }
        };

        startConnection();

        return () => {
            connection.stop();
            connectionRef.current = null;
        };

    }, [token]);

    return (
        <SignalRContext.Provider value={connectionRef}>
            {children}
        </SignalRContext.Provider>
    );
};

export const useSignalR = () => useContext(SignalRContext);