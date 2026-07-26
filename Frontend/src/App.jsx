import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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

            {/* Global Toast Notifications */}
            <Toaster
    position="bottom-right"
    reverseOrder={false}
    toastOptions={{
        duration: 3000,
        style: {
            background: '#ffffff',
            color: '#0f172a', // Slightly darker slate for better contrast
            border: '1px solid #e9d5ff', 
            borderRadius: '1rem', // Softer, rounder corners
            padding: '14px 18px', // More breathing room inside the toast
            fontFamily: "var(--font-fira-code, 'Fira Code', monospace)",
            fontWeight: '500', // Slightly bolder text for readability
            fontSize: '0.875rem',
            // Layered shadows for a premium, elevated look
            boxShadow: '0 10px 20px -5px rgba(108, 93, 231, 0.15), 0 4px 6px -2px rgba(108, 93, 231, 0.05)',
        },
        success: {
            iconTheme: {
                primary: '#6c5ce7',
                secondary: '#ffffff',
            },
            style: {
                borderLeft: '5px solid #6c5ce7', // Purple accent strip on the left
            }
        },
        error: {
            iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
            },
            style: {
                borderLeft: '5px solid #ef4444', // Red accent strip on the left
            }
        },
    }}
/>
        </>
    );
};

export default App;