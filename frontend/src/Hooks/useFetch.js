// hooks/useFetch.js
import { useState, useEffect } from 'react';
import api from '../api';

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Mỗi lần url thay đổi → mới fetch lại
        setLoading(true);
        setError(null);
        const FetchData = async () => {
            try {
                const res = await api.get(url);
                setData(res.data);
                setLoading(false);
                console.log("Fetched data:", res.data);
            }
            catch (err) {
                setError(err.response ? err.response.data : "Network error");
                setLoading(false);
            }
        }

        FetchData();
    }, [url]); // ← quan trọng: phụ thuộc vào url

    return { data, loading, error };
}

export default useFetch;