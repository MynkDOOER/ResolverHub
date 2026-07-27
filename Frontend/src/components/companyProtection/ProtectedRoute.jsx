import { Navigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

const ProtectedRoute = ({ children }) => {
	const companyId = useAuthStore((state) => state.user.companyId);

	if (!companyId) {
		return <Navigate to="/company" />;
	}
	return children;
};

export default ProtectedRoute;
