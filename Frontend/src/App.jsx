import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreateCompany from "./pages/CreateCompany";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const App = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route
						path="/signup"
						element={
							<PublicRoute>
								<Signup />
							</PublicRoute>
						}
					/>
					<Route
						path="/login"
						element={
							<PublicRoute>
								<Login />
							</PublicRoute>
						}
					/>
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/company/create"
						element={
							<ProtectedRoute>
								<CreateCompany />
							</ProtectedRoute>
						}
					/>
				</Route>
			</Routes>
		</>
	);
};

export default App;
