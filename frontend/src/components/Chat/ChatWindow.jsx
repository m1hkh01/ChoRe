import { useEffect, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { ProductPreview } from "./ProductPreview";
// import { createConnection } from "../../signalr/signalr";
import { useAuthStore } from "../../store/auth";
import { errorAlert } from "../../utils/alert";
import { useSignalR } from "../../signalr/SignalRContext";
export function ChatWindow({ conversationId }) {
    const { user } = useAuthStore();
    const connectionRef = useSignalR();
    const [conversation, setConversation] = useState(null);
    
    useEffect(() => {
        if (!conversationId || !connectionRef?.current) return;

        const connection = connectionRef.current;

        const joinRoom = async () => {
            // console.log("JOIN ROOM: ",connection.state);
            const interval = setInterval(async () => {
                if (connection.state !== "Connected") return;
                await connection.invoke("JoinConversation", conversationId.toString());
                clearInterval(interval);
            });
        };

        joinRoom();

        // ===== handlers =====
        const loadHandler = (messages) => {
            setConversation(messages);
        };

        const receiveHandler = (msg) => {
            setConversation(prev => ({
                ...prev,
                chatMessages: [...(prev?.chatMessages ?? []), msg]
            }));
        };

        const updateTransactionHandler = (data) => {
            setConversation(prev => {
                if (!prev) return prev;

                const exists = prev.chatMessages.some(
                    m => m.transaction?.transactionId === data.transaction.transactionId
                );

                return exists
                    ? {
                        ...prev,
                        chatMessages: prev.chatMessages.map(m =>
                            m.transaction?.transactionId === data.transaction.transactionId
                                ? { ...m, transaction: data.transaction }
                                : m
                        )
                    }
                    : prev;
            });
        };

        const notificationHandler = ({ notificationMessage }) => {
            errorAlert(notificationMessage);
        };

        // ===== register =====
        connection.on("LoadConversationMessages", loadHandler);
        connection.on("ReceiveMessage", receiveHandler);
        connection.on("UpdateTransaction", updateTransactionHandler);
        connection.on("Notification", notificationHandler);

        return () => {
            // ===== cleanup =====
            connection.off("LoadConversationMessages", loadHandler);
            connection.off("ReceiveMessage", receiveHandler);
            connection.off("UpdateTransaction", updateTransactionHandler);
            connection.off("Notification", notificationHandler);

            if (connection.state === "Connected") {
                connection.invoke("LeaveConversation", conversationId.toString())
                    .catch(() => { });
            }
        };
    }, [conversationId, connectionRef]);

    return (
        <>
            {
                conversation ? (
                    <div className="flex-1 flex flex-col bg-white h-full shadow-sm rounded-4">
                        <ChatHeader senderName={conversation?.senderName} senderAvatar={conversation?.senderAvatar} />
                        <ProductPreview post={conversation?.postInfo} />
                        <MessageList
                            userId={user?.userId}
                            messages={conversation?.chatMessages || []} 
                            priceType={conversation?.postInfo?.priceType}
                            connectionRef={connectionRef} />
                        <ChatInput
                            connectionRef={connectionRef}
                            conversationId={conversationId}
                            post={conversation?.postInfo}
                            buyerId={conversation?.buyerId}
                        />
                    </div>
                ) : <div className="h-full flex flex-col justify-center text-center mx-auto">
                        <h3>Chưa có cuộc trò chuyện nào</h3>
                        <span>Trải nghiệm chat để làm rõ thông tin về mặt hàng trước khi bắt đầu thực hiện mua bán</span>
                </div>
            }
        </>
    );
}
