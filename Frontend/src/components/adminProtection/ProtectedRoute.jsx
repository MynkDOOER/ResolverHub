import { Navigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

const ProtectedRoute = ({ children }) => {
	const role = useAuthStore((state) => state.user.role);

	if (role !== "Admin") {
		return <Navigate to="/company/my-project" />;
	}
	return children;
};

export default ProtectedRoute;
