import { Navigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

const PublicRoute = ({ children }) => {
	const role = useAuthStore((state) => state.user.role);

	if (role === "Admin") {
		return <Navigate to="/company/projects" />;
	}
	return children;
};

export default PublicRoute;
