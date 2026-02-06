import { createContext, useContext, useEffect, useRef } from "react";
import { createConnection } from "./signalr";

const SignalRContext = createContext(null);

export const SignalRProvider = ({ token, children }) => {
    const connectionRef = useRef(null);

    useEffect(() => {
        if (!token || connectionRef.current) return;

        const connection = createConnection(token);
        connectionRef.current = connection;

        connection.start().catch(err =>
            console.error("SignalR connect error:", err)
        );
        console.log("Connection ✅ Connected ");

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
