import { Navigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

const PublicRoute = ({ children }) => {
	const companyId = useAuthStore((state) => state.user.companyId);

	if (companyId) {
		return <Navigate to="/company/projects" />;
	}
	return children;
};

export default PublicRoute;

