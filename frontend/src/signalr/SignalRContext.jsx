import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createConnection } from "./signalr";

const SignalRContext = createContext(null);

export const SignalRProvider = ({ token, children }) => {
    const connectionRef = useRef(null);

    useEffect(() => {
        if (!token) return;

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
