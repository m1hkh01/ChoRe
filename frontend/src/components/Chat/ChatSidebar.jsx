import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import api from "../../api";
import { useSignalR } from "../../signalr/SignalRContext";

// const chats = Array(6).fill({
//     conversationId:1,
//     name: "Hồ Minh Quân",
//     message: "Ok bạn",
//     avatar: "https://i.pravatar.cc/40",
//     postImg: "https://i.pravatar.cc/30",
//     lastMessageTime: "2 giờ trước",
// });

export function ChatSidebar({userId, onJoinConversation }) {
    const [chats, setChats] = useState([]);
    const [currentConvertation, setCurrentConvertation] = useState(null);
    const connectionRef = useSignalR();

    function moveChatToTop(conversationId, newMessage) {
        setChats(prev => {
            // tìm chat cũ
            const chat = prev.find(c => c.chatRoomId  == conversationId);
            if (!chat) return prev;

            // cập nhật nội dung
            const updatedChat = {
                ...chat,
                lastMessageContent: newMessage.chatContent,
                lastMessageAt: newMessage.createdAt
            };

            // loại bỏ chat cũ
            const filtered = prev.filter(c => c.chatRoomId != conversationId);

            // đưa lên đầu
            return [updatedChat, ...filtered];
        });
    }

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await api.get(`/api/chat/${userId}`);
                setChats(res.data);
                console.log("Data: ", res.data);
                if (res.data.length > 0) {
                    onJoinConversation(res.data[0].chatRoomId);
                    setCurrentConvertation(res.data[0].chatRoomId);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchChats();
    }, [userId]);

    useEffect(() => {
        if (!connectionRef) return;

        const interval = setInterval(() => {
            const connection = connectionRef.current;
            if (!connection) return;

            console.log("Sidebar SignalR ready ✅: ",connection.state);

            const handler = (msg) => {
                console.log("đã nhận tin nhắn sidebar:", msg);
                moveChatToTop(msg.conversationId, msg);
            };

            connection.on("ReceiveMessage", handler);

            clearInterval(interval);

            return () => {
                connection.off("ReceiveMessage", handler);
            };
        }, 300);

        return () => clearInterval(interval);
    }, [connectionRef]);


    function TimeAgo(dateString) {
        if (dateString == null) {
            return;
        }
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now - past;

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return `${seconds} giây trước`;
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        return `${days} ngày trước`;
    }


    return (
        <div className="w-72 bg-white shadow-sm rounded-4 h-full">
            <div className="p-2 border-b-[rgba(220,207,207,0.3)] border-b-2 text-2xl font-bold">Chat</div>
            <div className="w-[calc(100%-30px)] p-1 rounded-3xl my-2 bg-[#F0F2F5] flex mx-auto">
                <div className="w-10">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2 mt-1" />
                </div>
                <input type="text" placeholder="Tìm kiếm đoạn chat" className="border-none focus:outline-none" />
            </div>
            <div className="h-[calc(100%-100px)] overflow-y-auto">
                {chats.length == 0 ?
                    (
                        <div className="p-4 text-center text-gray-500">Không có đoạn chat nào</div>
                    )
                    : chats.map((chat, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setCurrentConvertation(chat.chatRoomId);
                                onJoinConversation(chat.chatRoomId)
                            }}
                            className={`flex items-center gap-3 p-3 ${chat.chatRoomId == currentConvertation && "bg-gray-100"} hover:bg-gray-100 cursor-pointer`}
                        >
                            <div className="relative">
                                <img src={chat.senderAvatar ? `https://api.chore123.cloud/uploads/${chat.senderAvatar}` : "https://i.pravatar.cc/40"} className="w-12 h-12 rounded-full" />
                                <img src={`https://api.chore123.cloud/uploads/${chat.postInfo.postImageUrl}`} className="w-7 h-7 rounded-2 absolute -bottom-1 -right-2" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <div className="text-md font-medium">{chat.senderName}</div>
                                    <div className="text-xs font-extralight text-[rgba(0,0,0,0.5)]">{TimeAgo(chat.lastMessageAt) ?? ""}</div>
                                </div>
                                <div className="text-xs text-gray-500 truncate mt-1">
                                    {chat.lastMessageContent ?? "Chưa có tin nhắn"}
                                </div>
                            </div>
                        </div>
                
                    ))}
            </div>
        </div>
    );
}
