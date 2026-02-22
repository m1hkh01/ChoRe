import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api";
import Pay from "./Pay";

export default function PackagePayPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Pkg data: ", orderId);
        const fetchPackageData = async () => {
            try {
                const res = await api.get(`api/package/service-order/${orderId}`)
                console.log("Package data: ", res.data);
                setPkg(res.data);
            } catch (err) {
                console.error("Error: ", err);
                alert("Không tìm thấy gói dịch vụ");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };
        fetchPackageData();
    }, []);
    if (loading) return <div className="p-6">Đang tải...</div>;
    if (!pkg) return null;
    return (
        <Pay
            pkg={pkg}
            orderCode={pkg?.serviceCode}
            paymentType="Package"
            onClose={() => navigate(-1)}
        />
    )
}
