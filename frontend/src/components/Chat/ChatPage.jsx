import { useState } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { useAuthStore } from "../../store/auth";
export default function ChatPage() {
    const [conversationId, setConversationId] = useState(null);
    const { user } = useAuthStore();
    const handleJoinConversation = (id) => {
        setConversationId(id);
    }
    return (
        <div className="h-[calc(100vh-60px)] bg-gray-100 flex gap-4">
            <ChatSidebar userId={user.userId} onJoinConversation={handleJoinConversation} />
            <ChatWindow conversationId={conversationId} />
        </div>
    );
}
