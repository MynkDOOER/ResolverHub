import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { useEffect, useState, useRef } from "react";
import { Bell, Menu, X, LogOut, ChevronRight, Briefcase, Zap } from "lucide-react";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch notifications");
        }

        setNotifications(
          Array.isArray(data.notifications) ? data.notifications : []
        );
      } catch (err) {
        console.error("Failed to fetch notifications:", err.message);
      }
    };

    if (token) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [token]);

  const unreadNotificationCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const companyRequestCount = notifications.filter(
    (notification) =>
      notification.type === "Company_Join_Request" &&
      notification.actionStatus === "Pending"
  ).length;

  return (
    <nav 
      className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm"
      style={{ fontFamily: "'Fira Code', monospace" }}
    >
      {/* Removed max-w-7xl to let the navbar stretch edge-to-edge */}
      <div className="px-4 sm:px-8 lg:px-12 w-full">
        <div className="flex h-16 items-center justify-between">
          
          {/* LEFT: LOGO */}
          <div className="flex items-center">
            <Link
              to="/"
              className="group flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 transition-all hover:text-red-600"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-md shadow-red-200 transition-transform group-hover:scale-105">
                <Zap size={18} fill="currentColor" />
              </div>
              <span>
                Resolver<span className="text-red-600">Hub</span>
              </span>
            </Link>
          </div>

          {/* RIGHT: DESKTOP NAVIGATION */}
          <div className="hidden md:flex md:items-center md:gap-5">
            {user && (
              <div className="flex items-center gap-5">
                {!user.companyId ? (
                  <Link
                    to="/company/setup"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-red-600"
                  >
                    Get Started
                  </Link>
                ) : (
                  <Link
                    to="/company/projects"
                    className="group flex items-center gap-2 rounded-md bg-gray-50 px-3 py-1.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 transition-all hover:bg-red-50 hover:text-red-700 hover:ring-red-200"
                  >
                    <Briefcase size={16} className="text-gray-500 transition-colors group-hover:text-red-600" />
                    Projects
                  </Link>
                )}

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-gray-200"></div>

                {/* NOTIFICATION BELL */}
                <div className="relative flex items-center" ref={notificationRef}>
                  <button
                    onClick={() => {
                      setIsNotificationOpen((prev) => !prev);
                      setNotifications((prev) =>
                        prev.map((notif) => ({ ...notif, isRead: true }))
                      );
                    }}
                    className="relative rounded-full p-1.5 text-gray-500 transition-all hover:bg-red-50 hover:text-red-600 focus:outline-none"
                    aria-label="Notifications"
                  >
                    <Bell size={20} className={isNotificationOpen ? "fill-red-100 text-red-600" : ""} />
                    
                    {unreadNotificationCount > 0 && (
                      <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white ring-2 ring-white">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </button>

                  {/* NOTIFICATION DROPDOWN */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 top-10 mt-2 w-80 origin-top-right overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl shadow-red-900/5 transition-all">
                      <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/50 px-4 py-3">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        {unreadNotificationCount > 0 && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                            {unreadNotificationCount} new
                          </span>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto p-2">
                        {companyRequestCount > 0 ? (
                          <Link
                            to="/company/requests"
                            onClick={() => setIsNotificationOpen(false)}
                            className="group flex items-start gap-4 rounded-lg p-3 transition-all hover:bg-red-50"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                              <Briefcase size={18} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-red-700">
                                {companyRequestCount} pending company {companyRequestCount === 1 ? "request" : "requests"}
                              </p>
                              <p className="mt-0.5 text-xs text-gray-500">Click to review and approve</p>
                            </div>
                            <ChevronRight size={16} className="mt-2 text-gray-400 group-hover:text-red-600" />
                          </Link>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                              <Bell size={24} />
                            </div>
                            <p className="text-sm font-medium text-gray-900">All caught up!</p>
                            <p className="text-xs text-gray-500">No new notifications right now.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* AVATAR & LOGOUT */}
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-200 transition-all hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    {/* <img
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      alt="Profile"
                      className="h-full w-full object-cover"
                    /> */}
                    {user.name[0].toUpperCase()}
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* NOT LOGGED IN STATE */}
            {!user && (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-red-600"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-md bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center gap-4 md:hidden">
            {user && (
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-gray-500"
              >
                <Bell size={20} />
                {unreadNotificationCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white" />
                )}
              </button>
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-6 shadow-2xl md:hidden">
          <div className="flex flex-col space-y-4">
            {user ? (
              <>
                <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="Profile"
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">My Account</p>
                    <Link to="/profile" className="text-xs text-red-600 hover:underline">View Profile</Link>
                  </div>
                </div>

                {user.companyId ? (
                  <Link
                    to="/company/projects"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-700"
                  >
                    <Briefcase size={18} /> Projects
                  </Link>
                ) : (
                  <Link
                    to="/company/setup"
                    className="rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-700"
                  >
                    Get Started
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-base font-medium text-gray-600 hover:bg-gray-100"
                >
                  <LogOut size={18} /> Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 text-center text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-gradient-to-r from-red-600 to-orange-500 px-3 py-2.5 text-center text-base font-medium text-white shadow-sm hover:opacity-90"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;