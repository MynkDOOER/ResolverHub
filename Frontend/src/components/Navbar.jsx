import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is authenticated (token exists in localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Logout Handler
  const handleLogout = () => {
    // 1. Remove the JWT token
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // 2. Redirect to Login page
    navigate("/login");
  };

  return (
    <div 
      className="navbar sticky top-0 z-50 border-b border-purple-100/50 bg-white/70 px-4 backdrop-blur-md transition-all duration-300 sm:px-8" 
      style={{ fontFamily: "'Fira Code', monospace" }}
    >
      
      <div className="navbar-start flex items-center gap-4">
        
        <div className="dropdown dropdown-bottom dropdown-start">
          <label 
            tabIndex={0} 
            className="btn btn-ghost btn-circle avatar h-10 w-10 min-h-0 relative group cursor-pointer"
            aria-label="User menu"
          >
            <div className="w-9 h-9 rounded-full ring-2 ring-purple-100 transition-all duration-300 group-hover:ring-purple-500 group-hover:scale-105 shadow-sm">
              <img 
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                alt="Profile Avatar" 
                className="object-cover"
              />
            </div>
          </label>
          
          <ul 
            tabIndex={0} 
            className="menu dropdown-content menu-sm z- mt-3 w-48 rounded-2xl border border-purple-100/60 bg-white p-2 font-semibold text-slate-600 shadow-xl shadow-purple-900/5 backdrop-blur-md"
          >
            <li>
              <Link to="/profile" className="rounded-xl px-4 py-2.5 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                My Profile
              </Link>
            </li>
            <div className="my-1 border-t border-purple-50"></div>
            <li>
              <button 
                onClick={handleLogout}
                className="rounded-xl px-4 py-2.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-bold transition-colors"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>

        <Link 
          to="/" 
          className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-300 hover:opacity-85"
        >
          Bug Vault
        </Link>
      </div>

      <div className="navbar-end hidden lg:flex">
        <ul className="flex items-center gap-8 px-1 text-sm font-semibold text-slate-500">
          
          
          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/signup" className="transition-colors duration-200 hover:text-purple-600">
                  Signup
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="rounded-xl bg-purple-600 px-5 py-2 text-white font-semibold shadow-sm shadow-purple-500/15 transition-all duration-200 hover:bg-purple-700 hover:shadow-purple-500/25 active:scale-95"
                >
                  Login
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button 
                onClick={handleLogout}
                className="rounded-xl bg-rose-50 px-5 py-2 text-rose-600 font-semibold transition-all duration-200 hover:bg-rose-100 active:scale-95"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end flex lg:hidden">
        <div className="dropdown dropdown-end">
          <label 
            tabIndex={0} 
            className="btn btn-ghost btn-circle text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul 
            tabIndex={0} 
            className="menu dropdown-content menu-sm z- mt-3 w-52 rounded-2xl border border-purple-100/60 bg-white p-2.5 font-semibold text-slate-600 shadow-xl shadow-purple-900/5 backdrop-blur-md"
          >
            <li>
              <Link to="/" className="rounded-xl px-4 py-2 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                Home
              </Link>
            </li>

            {!isLoggedIn ? (
              <>
                <li>
                  <Link to="/signup" className="rounded-xl px-4 py-2 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                    Signup
                  </Link>
                </li>
                <div className="my-1 border-t border-purple-50/60"></div>
                <li>
                  <Link 
                    to="/login" 
                    className="rounded-xl bg-purple-50 px-4 py-2 text-center font-bold text-purple-700 hover:bg-purple-100 hover:text-purple-800 transition-all"
                  >
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/profile" className="rounded-xl px-4 py-2 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                    My Profile
                  </Link>
                </li>
                <div className="my-1 border-t border-purple-50/60"></div>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="rounded-xl bg-rose-50 px-4 py-2 text-center font-bold text-rose-600 hover:bg-rose-100 transition-all"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      
    </div>
  );
}

export default Navbar;