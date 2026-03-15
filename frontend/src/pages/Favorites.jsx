import { useEffect, useState } from "react";
import FavoriteItem from "@/components/Favorite/FavoriteItem";
import { useAuthStore } from "@/store/auth";
import "@/assets/Favorite.css";
import api from "@/api";

function Favorites() {

    const { user } = useAuthStore();

    const [favorites, setFavorites] = useState([]);

    

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const res = await api.get("/api/save-posts");
                console.log("RESPONSE:", res);

                setFavorites(res.data);
            } catch (err) {
                console.error("API ERROR:", err.response || err);
            }
        };

        loadFavorites();

        window.addEventListener(
            "favoritesUpdated",
            loadFavorites
        );

        return () =>
            window.removeEventListener(
                "favoritesUpdated",
                loadFavorites
            );

    }, []);
    if (!user) {
        return <div className="container mt-4">Vui lòng đăng nhập để xem yêu thích</div>;
    }
    const removeFavorite = (postId) => {

        const updatedIds =
            favorites
                .filter(post => post.postId !== postId)
                .map(post => post.postId);   // ✅ chỉ lưu ID

        localStorage.setItem(
            `favorites_${user.userId}`,
            JSON.stringify(updatedIds)
        );

        setFavorites(
            favorites.filter(post => post.postId !== postId)
        );

        window.dispatchEvent(
            new Event("favoritesUpdated")
        );
    };

    return (

        <div className="favorite-page container mt-4">

            <h4>Tin đăng đã lưu ({favorites.length}/100)</h4>

            <div className="favorite-content bg-white rounded shadow-sm">

                {favorites.length === 0 ? (
                    <div className="p-4">
                        Chưa có tin yêu thích
                    </div>
                ) : (
                    favorites.map(post => (
                        <FavoriteItem
                            key={post.postId}
                            post={post}
                            onRemove={removeFavorite}
                        />
                    ))
                )}

            </div>

        </div>

    );

}

export default Favorites;