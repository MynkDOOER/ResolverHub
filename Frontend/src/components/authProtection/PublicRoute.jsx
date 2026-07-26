import { Navigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

const PublicRoute = ({ children }) => {
	const token = useAuthStore((state) => state.token);

	if (token) {
		return <Navigate to="/" />;
	}
	return children;
};

export default PublicRoute;
