import { useAuthStore } from "../store/auth";
function RequireRole({ roles, children }) {
    const { user } = useAuthStore();

    if (!user) return <Navigate to="/login" />;

    if (!roles.includes(user.role)) {
        return <Navigate to="/403" replace />;
    }

    return children;
};
export default RequireRole;
