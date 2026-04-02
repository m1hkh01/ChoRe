// ChatPage.jsx — bao gồm ChatSidebar + ChatWindow + CSS

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faCommentDots, faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import api from "../api";
import { useAuthStore } from "../store/auth";
import { SignalRProvider, useSignalR } from "../signalr/SignalRContext";
import { ChatHeader } from "../components/Chat/ChatHeader";
import { ChatInput } from "../components/Chat/ChatInput";
import { MessageList } from "../components/Chat/MessageList";
import { ProductPreview } from "../components/Chat/ProductPreview";
import { errorAlert } from "../utils/alert";

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .cp {
    display: flex;
    height: calc(100vh - 64px);
    background: #f1f5f9;
    overflow: hidden;
    position: relative;
  }

  /* ── Sidebar ─────────────────────────────────────────────────────── */
  .cp-sb {
    width: 350px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-right: 1px solid #e2e8f0;
  }

  .cp-sb-head {
    padding: 20px 16px 12px;
    border-bottom: 1px solid #f1f5f9;
    flex-shrink: 0;
  }

  .cp-sb-title {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 12px;
  }

  .cp-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 8px 12px;
    transition: border-color 0.15s;
  }

  .cp-search:focus-within { border-color: #22c55e; }
  .cp-search svg  { font-size: 15px; color: #94a3b8; flex-shrink: 0; }
  .cp-search input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 15px;
    color: #0f172a;
    min-width: 0;
  }
  .cp-search input::placeholder { color: #94a3b8; }

  /* ── Chat list ───────────────────────────────────────────────────── */
  .cp-list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
  }
  .cp-list::-webkit-scrollbar       { width: 3px; }
  .cp-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }

  .cp-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f8fafc;
    transition: background 0.12s;
  }

  .cp-item:hover  { background: #f8fafc; }
  .cp-item.active { background: #f0fdf4; border-left: 3px solid #22c55e; padding-left: 13px; }

  .cp-av-wrap { position: relative; flex-shrink: 0; }

  .cp-av {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }

  .cp-post-img {
    position: absolute;
    bottom: -2px;
    right: -4px;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    object-fit: cover;
    border: 2px solid #fff;
  }

  .cp-item-info    { flex: 1; min-width: 0; }

  .cp-item-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 6px;
    margin-bottom: 2px;
  }

  .cp-item-name {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cp-item-time { font-size: 15px; color: #94a3b8; flex-shrink: 0; }

  .cp-item-preview {
    font-size: 15px;
    color: #94a3b8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cp-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex: 1;
    padding: 40px 20px;
    text-align: center;
    color: #94a3b8;
  }
  .cp-empty svg  { font-size: 36px; opacity: 0.3; }
  .cp-empty span { font-size: 15px; }

  /* ── Main window ─────────────────────────────────────────────────── */
  .cp-win {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;
    min-width: 0;
    overflow: hidden;
  }

  /* Chỉ MessageList scroll — ChatInput cố định đáy */
  .cp-msg-scroll {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
  }
  .cp-msg-scroll::-webkit-scrollbar       { width: 4px; }
  .cp-msg-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }

  .cp-win-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 40px 20px;
    text-align: center;
    background: #f8fafc;
    color: #94a3b8;
  }
  .cp-win-empty svg { font-size: 52px; opacity: 0.25; }
  .cp-win-empty h3  { margin: 0; font-size: 17px; font-weight: 600; color: #475569; }
  .cp-win-empty p   { margin: 0; font-size: 15px; max-width: 260px; line-height: 1.6; }

  /* ── Mobile back ─────────────────────────────────────────────────── */
  .cp-back {
    display: none;
    align-items: center;
    gap: 8px;
    padding: 11px 14px;
    border: none;
    border-bottom: 1px solid #f1f5f9;
    background: #fff;
    font-size: 13px;
    font-weight: 600;
    color: #22c55e;
    cursor: pointer;
    width: 100%;
    text-align: left;
    flex-shrink: 0;
    transition: background 0.15s;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .cp-back:hover { background: #f0fdf4; }

  /* ── Responsive ──────────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .cp { position: relative; }

    /* Sidebar chiếm toàn màn hình, ẩn khi đang chat */
    .cp-sb {
      position: absolute;
      inset: 0;
      width: 100%;
      z-index: 10;
      transition: transform 0.28s cubic-bezier(0.22,1,0.36,1);
    }

    .cp.chatting .cp-sb {
      transform: translateX(-100%);
      pointer-events: none;
    }

    /* Window ẩn mặc định, hiện khi đang chat */
    .cp-win {
      position: absolute;
      inset: 0;
      z-index: 5;
      transform: translateX(100%);
      transition: transform 0.28s cubic-bezier(0.22,1,0.36,1);
    }

    .cp.chatting .cp-win {
      transform: translateX(0);
    }

    .cp-back { display: flex; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateString) {
  if (!dateString) return "";
  const diff = Date.now() - new Date(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return `${seconds}s`;
  if (minutes < 60) return `${minutes}ph`;
  if (hours < 24) return `${hours}g`;
  return `${days}n`;
}

const UPLOADS = "https://api.chore123.cloud/uploads/";

// ─── ChatSidebar ──────────────────────────────────────────────────────────────

function ChatSidebar({ userId, activeId, onJoin }) {
  const [chats, setChats] = useState([]);
  const [query, setQuery] = useState("");
  const connectionRef = useSignalR();

  useEffect(() => {
    api.get(`/api/chat/${userId}`)
      .then(r => setChats(r.data))
      .catch(console.error);
  }, [userId]);

  useEffect(() => {
    const handler = (msg) => {
      setChats(prev => {
        const found = prev.find(c => c.chatRoomId == msg.conversationId);
        if (!found) return prev;
        const updated = {
          ...found,
          lastMessageContent: msg.chatContent,
          lastMessageAt: msg.createdAt
        };
        return [updated, ...prev.filter(c => c.chatRoomId != msg.conversationId)];
      });
    };

    const handleNewChat = (room) => {
      setChats(prev => {
        console.log("New chat: ", room);
        console.log("Current chats: ", prev);
        const filtered = prev.filter(r => r.chatRoomId !== room.chatRoomId);
        return [room, ...filtered];
      });
    };

    const tryOn = () => {
      const conn = connectionRef?.current;

      if (!conn) {
        setTimeout(tryOn, 500);
        return;
      }

      if (conn.state === "Connected") {
        conn.on("ReceiveMessage", handler);
        conn.on("NewConversationCreated", handleNewChat);
      } else {
        setTimeout(tryOn, 500);
      }
    };

    tryOn();

    return () => {
      const conn = connectionRef?.current;
      if (!conn) return;

      conn.off("ReceiveMessage", handler);
      conn.off("NewConversationCreated", handleNewChat);
    };
  }, [connectionRef]);

  const filtered = chats.filter(c =>
    !query || c.senderName?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="cp-sb">
      <div className="cp-sb-head">
        <p className="cp-sb-title">Tin nhắn</p>
        <div className="cp-search">
          <FontAwesomeIcon icon={faSearch} />
          <input
            placeholder="Tìm kiếm..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="cp-list">
        {filtered.length === 0 ? (
          <div className="cp-empty">
            <FontAwesomeIcon icon={faCommentDots} />
            <span>Chưa có đoạn chat nào</span>
          </div>
        ) : filtered.map((chat, i) => (
          <div
            key={i}
            className={`cp-item ${chat.chatRoomId === activeId ? "active" : ""}`}
            onClick={() => onJoin(chat.chatRoomId)}
          >
            <div className="cp-av-wrap">
              <img
                src={chat.senderAvatar ? `${UPLOADS}${chat.senderAvatar}` : "https://i.pravatar.cc/44"}
                className="cp-av"
                alt={chat.senderName}
              />
              {chat.postInfo?.postImageUrl && (
                <img src={`${UPLOADS}${chat.postInfo.postImageUrl}`} className="cp-post-img" alt="" />
              )}
            </div>

            <div className="cp-item-info">
              <div className="cp-item-row">
                <span className="cp-item-name">{chat.senderName}</span>
                <span className="cp-item-time">{timeAgo(chat.lastMessageAt)}</span>
              </div>
              <div className="cp-item-preview">
                {chat.lastMessageContent ?? "Chưa có tin nhắn"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ChatWindow ───────────────────────────────────────────────────────────────

function ChatWindow({ conversationId, onBack }) {
  const { user } = useAuthStore();
  const connectionRef = useSignalR();
  const [conv, setConv] = useState(null);
  const bottomRef = useRef(null);

  // Auto-scroll xuống cuối mỗi khi messages thay đổi
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conv?.chatMessages?.length]);

  useEffect(() => {
    if (!conversationId || !connectionRef?.current) return;
    const conn = connectionRef.current;

    const tryJoin = async () => {
      if (conn.state === "Connected") {
        await conn.invoke("JoinConversation", conversationId.toString());
      } else {
        setTimeout(tryJoin, 1000);
      }
    };

    tryJoin();

    const onLoad = (msgs) => { console.log("Message: ",msgs); setConv(msgs) };
    const onReceive = (msg) => setConv(p => ({ ...p, chatMessages: [...(p?.chatMessages ?? []), msg] }));
    const onUpdate = (data) => setConv(p => {
      console.log("UpdateTransaction: ", data);
      
      if (!p) return p;
      const exists = p.chatMessages.some(m => m.transaction?.transactionId === data.transaction.transactionId);
      console.log("Current conv: ", exists);
      return exists
        ? {
          ...p, chatMessages: p.chatMessages.map(m =>
            m.transaction?.transactionId === data.transaction.transactionId
              ? { ...m, transaction: data.transaction } : m
          )
        }
        : p;
    });
    const onNotif = ({ notificationMessage }) => errorAlert(notificationMessage);

    conn.on("LoadConversationMessages", onLoad);
    conn.on("ReceiveMessage", onReceive);
    conn.on("UpdateTransaction", onUpdate);
    conn.on("Notification", onNotif);

    return () => {
      conn.off("LoadConversationMessages", onLoad);
      conn.off("ReceiveMessage", onReceive);
      conn.off("UpdateTransaction", onUpdate);
      conn.off("Notification", onNotif);
      if (conn.state === "Connected")
        conn.invoke("LeaveConversation", conversationId.toString()).catch(() => { });
    };
  }, [conversationId, connectionRef]);

  if (!conversationId) {
    return (
      <div className="cp-win cp-win-empty">
        <FontAwesomeIcon icon={faCommentDots} />
        <h3>Chưa chọn cuộc trò chuyện</h3>
        <p>Chọn một đoạn chat từ danh sách để bắt đầu nhắn tin</p>
      </div>
    );
  }

  return (
    <div className="cp-win">
      {/* Nút quay lại nằm ngoài scroll, cố định trên cùng */}
      <button className="cp-back" onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
        Quay lại
      </button>

      {conv ? (
        <>
          <ChatHeader senderName={conv.senderName} senderAvatar={conv.senderAvatar} />
          <ProductPreview post={conv.postInfo} />
          <div className="cp-msg-scroll">
            <MessageList
              userId={user?.userId}
              messages={conv.chatMessages ?? []}
              priceType={conv.postInfo?.priceType}
              connectionRef={connectionRef}
            />
            <div ref={bottomRef} />
          </div>
          <ChatInput
            connectionRef={connectionRef}
            conversationId={conversationId}
            post={conv.postInfo}
            buyerId={conv.buyerId}
            isActive={conv.isActive}
          />
        </>
      ) : (
        <div className="cp-win-empty">
          <FontAwesomeIcon icon={faCommentDots} />
          <h3>Đang tải...</h3>
        </div>
      )}
    </div>
  );
}

// ─── ChatPage ─────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { user, token } = useAuthStore();
  const [convId, setConvId] = useState(null);

  return (
    <>
      <style>{CSS}</style>
      <SignalRProvider token={token}>
        <div className={`cp ${convId ? "chatting" : ""}`}>
          <ChatSidebar
            userId={user.userId}
            activeId={convId}
            onJoin={setConvId}
          />
          <ChatWindow
            conversationId={convId}
            onBack={() => setConvId(null)}
          />
        </div>
      </SignalRProvider>
    </>
  );
}