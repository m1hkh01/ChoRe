import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { ProductPreview } from "./ProductPreview";
import { createConnection } from "../../signalr/signalr";
import { useAuthStore } from "../../store/auth";
export function ChatWindow({ conversationId }) {
    const { token, user } = useAuthStore();
    const connectionRef = useRef(null);
    const [conversation, setConversation] = useState(null);
    useEffect(() => {
        if (!conversationId) return;
        let isMounted = true;

        const startConnection = async () => {
            const connection = createConnection(token);

            connectionRef.current = connection;

            try {

                await connection.start();
                console.log(" ✅ Connected");

                if (!isMounted) return;

                connection.on("LoadConversationMessages", (messages) => {
                    console.log("đã nhận tin nhắn: ", messages);
                    setConversation(messages);
                });

                await connection.invoke("JoinConversation", conversationId.toString())

                connection.on("ReceiveMessage", (msg) => {
                    console.log("đã nhận tin nhắn: ", msg)

                    setConversation(prev => ({
                        ...prev,
                        chatMessages: [...(prev?.chatMessages ?? []), msg]
                    }));

                });

                // Lắng nghe cập nhật giao dịch trung gian
                connection.on("UpdateTransaction", (data) => {
                    console.log("Cập nhật giao dịch: ", data);

                    setConversation(prev => ({
                        ...prev,
                        ChatMessages: (prev?.ChatMessages ?? []).map(msg => {
                            if (msg.EscrowTransaction?.EscrowTransactionId === data.escrowId) {
                                return {
                                    ...msg,
                                    EscrowTransaction: data.data
                                };
                            }
                            return msg;
                        })
                    }));
                });

            } catch (err) {
                console.error("❌ SignalR error:", err);
            }

        }
        startConnection();

        return () => {
            isMounted = false;


            if (connectionRef.current) {
                connectionRef.current.invoke("LeaveConversation", conversationId);
                connectionRef.current.stop();
            }
        };
    }, [conversationId, token]);

    return (
        <div className="flex-1 flex flex-col bg-white h-full shadow-sm rounded-4">
            <ChatHeader senderName={conversation?.senderName} senderAvatar={conversation?.senderAvatar} />
            <ProductPreview post={conversation?.postInfo} />
            <MessageList userId={user?.userId} sellerId={conversation?.postInfo.userId} messages={conversation?.chatMessages || []} connectionRef={connectionRef} />
            <ChatInput
                connectionRef={connectionRef}
                conversationId={conversationId}
                post={conversation?.postInfo}
            />
        </div>
    );
}
