export function ProductPreview({ post }) {
    // console.log("Post: ", post);
    return (
        <div className="flex items-center gap-3 p-3 bg-white  shadow-sm rounded-3">
            <div className=" bg-gray-200 rounded flex items-center justify-center p-1">
                <img src={post?.postImageUrl ? "https://api.chore123.cloud/uploads/"+ post.postImageUrl : "https://i.pravatar.cc/40"} className="w-12.5 h-12.5" />
            </div>
            <div>
                <div className="font-medium">{post?.postTitle}</div>
                <div className="text-red-500 font-semibold">
                    {
                        post.priceType.toLowerCase() == "fixed"
                            ? Number(post?.postPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                            : post.priceType.toLowerCase() == "range"
                            ? Number(post?.minPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                                + " - " +
                              Number(post?.maxPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" }) 
                            : "Thương lượng"
                    }
                </div>
            </div>
        </div>
    );
}
