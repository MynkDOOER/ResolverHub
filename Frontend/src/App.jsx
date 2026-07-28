import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./layout/Layout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AuthProtectedRoute from "./components/authProtection/ProtectedRoute";
import AuthPublicRoute from "./components/authProtection/PublicRoute";
import ProjectsView from "./pages/ProjectsView";
import CompanyProtectedRoute from "./components/companyProtection/ProtectedRoute";
import CompanyPublicRoute from "./components/companyProtection/PublicRoute";
import CompanySetup from "./pages/CompanySetup";
import CompanyRequests from "./pages/companyRequests";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="/signup"
            element={
              <AuthPublicRoute>
                <Signup />
              </AuthPublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <AuthPublicRoute>
                <Login />
              </AuthPublicRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthProtectedRoute>
                <Profile />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/company/setup"
            element={
              <AuthProtectedRoute>
                <CompanyPublicRoute>
                  <CompanySetup />
                </CompanyPublicRoute>
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/company/projects"
            element={
              <AuthProtectedRoute>
                <CompanyProtectedRoute>
                  <ProjectsView />
                </CompanyProtectedRoute>
              </AuthProtectedRoute>
            }
          />

          <Route
            path="/company/requests"
            element={
              <AuthProtectedRoute>
                <CompanyProtectedRoute>
                  <CompanyRequests />
                </CompanyProtectedRoute>
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthProtectedRoute>
                <Profile />
              </AuthProtectedRoute>
            }
          />
        </Route>
      </Routes>

      {/* Global Toast Notifications */}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #e9d5ff",
            borderRadius: "1rem",
            padding: "14px 18px",
            fontFamily: "var(--font-fira-code, 'Fira Code', monospace)",
            fontWeight: "500",
            fontSize: "0.875rem",

            boxShadow:
              "0 10px 20px -5px rgba(108, 93, 231, 0.15), 0 4px 6px -2px rgba(108, 93, 231, 0.05)",
          },
          success: {
            iconTheme: {
              primary: "#7ca668",
              secondary: "#ffffff",
            },
            style: {
              borderLeft: "5px solid #7ca668",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
            style: {
              borderLeft: "5px solid #ef4444",
            },
          },
        }}
      />
    </>
  );
};

export default App;
