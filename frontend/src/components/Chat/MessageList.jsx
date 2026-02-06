import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TransactionCard } from "./TransactionCard/TransactionCard";

// const messages = [
//     { from: "other", text: "Không giảm được nữa đâu" },
//     { from: "me", text: "Giảm giá xíu đi Bro" },
//     { from: "me", text: "7 triệu chốt" },
//     { from: "other", text: "Ok bạn" },
// ];

export function MessageList({ userId, messages, priceType, connectionRef }) {
    // console.log("Messages list: ", messages);
    return (
        <div className="flex-1 p-2 mt-2 space-y-3 overflow-y-auto">
            {messages?.map((msg, i) => {
                // Nếu là transaction message
                if (msg.messageType?.toLowerCase() === "transaction" || msg.MessageType?.toLowerCase() === "transaction") {
                    return (
                        <div key={i} className="flex justify-center">
                            <TransactionCard
                                priceType={priceType}
                                transaction={msg.transaction}
                                currentUserId={userId}
                                connectionRef={connectionRef}
                            />
                        </div>
                    );
                }

                // Nếu là text message
                return (
                    <div
                        key={i}
                        className={`flex ${msg.fromUserId == userId ? "justify-end" : "justify-start"
                            }`}
                    >

                        {/* {msg.fromUserId != userId && (
                            <div className="w-12 h-14 flex justify-center items-start">
                                <img
                                    src={"https://i.pravatar.cc/40"}
                                    className="w-8 h-8 rounded-full"
                                />
                            </div>
                        )} */}
                        <div className="flex flex-col mb-2">
                            {(msg.imageUrls || msg.ImageUrls || (msg.messageImages && msg.messageImages.map)) && (
                                <div className="flex gap-1 flex-wrap">
                                    {(msg.imageUrls || msg.ImageUrls || (msg.messageImages && msg.messageImages.map(mi => mi.imageUrl)) || []).map((img, idx) => (
                                        <img key={idx} src={`http://localhost:5121/images/chat-Image/${img}`} className="w-24 h-24 object-cover rounded shadow-sm mb-1 border" />
                                    ))}
                                </div>
                            )}
                            <div
                                className={`px-3 py-2 rounded-lg text-md max-w-xs h-max mb-2 ${msg.fromUserId == userId
                                    ? "bg-green-500 text-white rounded-br-none self-end"
                                    : "bg-gray-200 text-gray-800 rounded-tl-none self-start"
                                    }`}
                            >
                                {msg.chatContent ?? msg.ChatContent ?? msg.content ?? msg.Content}

                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

