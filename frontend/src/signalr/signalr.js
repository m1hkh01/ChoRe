import * as signalR from "@microsoft/signalr";

export const createConnection = (token) =>
    new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5121/chatHub", {
            accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();
