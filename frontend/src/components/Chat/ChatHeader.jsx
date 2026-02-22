export function ChatHeader({senderName, senderAvatar}) {
    return (
        <div className="flex items-center gap-3 p-4 border-b-[rgba(220,207,207,0.3)] border-b-2">
            <div className="relative">
                <img
                    src={senderAvatar ? `http://localhost:5121/uploads/${senderAvatar}` : "https://i.pravatar.cc/40"}
                    className="w-10 h-10 rounded-full"
                />
                <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border border-white"></div>
            </div>
            <div>
                <div className="font-semibold">{senderName}</div>
                <div className="text-xs text-green-500">Đang hoạt động</div>
            </div>
        </div>
    );
}
