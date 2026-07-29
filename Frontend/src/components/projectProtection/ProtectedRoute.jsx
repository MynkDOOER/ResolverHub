import { Navigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

const ProtectedRoute = ({ children }) => {
	const projectId = useAuthStore((state) => state.user.projectId);

	if (!projectId) {
		return <Navigate to="/company/projects" />;
	}
	return children;
};

export default ProtectedRoute;
