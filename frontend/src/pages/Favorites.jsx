import { useEffect, useState } from "react";
import FavoriteItem from "@/components/Favorite/FavoriteItem";

function Favorites() {

    const [favorites, setFavorites] = useState([]);

    const loadFavorites = () => {

        const data =
            JSON.parse(localStorage.getItem("favorites")) || [];

        setFavorites(data);

    };

    useEffect(() => {

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

    const removeFavorite = (postId) => {

        const updated =
            favorites.filter(
                post => post.postId !== postId
            );

        localStorage.setItem(
            "favorites",
            JSON.stringify(updated)
        );

        setFavorites(updated);

        window.dispatchEvent(
            new Event("favoritesUpdated")
        );

    };

    return (

        <div className="container mt-4">

            <h4>
                Tin đăng đã lưu ({favorites.length}/100)
            </h4>

            <div className="bg-white rounded shadow-sm">

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