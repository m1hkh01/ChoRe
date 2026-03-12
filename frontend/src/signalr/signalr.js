import * as signalR from "@microsoft/signalr";

export const createConnection = (token) =>
    new signalR.HubConnectionBuilder()
        .withUrl("https://api.chore123.cloud/chatHub", {
        // .withUrl("http://localhost:5121", {
            accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();
