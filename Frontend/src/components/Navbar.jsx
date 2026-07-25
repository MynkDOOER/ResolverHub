import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div 
      className="navbar sticky top-0 z-50 border-b border-purple-100 bg-white/80 px-4 backdrop-blur-md sm:px-8" 
      style={{ fontFamily: "'Fira Code', monospace" }}
    >
      
      <div className="navbar-start">
        <Link to="/" className="text-xl font-bold tracking-tight text-purple-600 transition-colors hover:text-purple-700">
          Bug Vault
        </Link>
      </div>

      <div className="navbar-end hidden lg:flex">
        <ul className="flex items-center gap-6 px-1 text-sm font-semibold text-slate-600">
          <li>
            <Link to="/" className="transition-colors hover:text-purple-600">Home</Link>
          </li>
          <li>
            <Link to="/signup" className="transition-colors hover:text-purple-600">Signup</Link>
          </li>
          <li>

            <Link 
              to="/login" 
              className="rounded-lg bg-purple-50 px-5 py-2 text-purple-700 transition-colors hover:bg-purple-100"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end flex lg:hidden">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost text-slate-600 hover:bg-purple-50 hover:text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul 
            tabIndex={0} 
            className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-xl border border-purple-100 bg-white p-2 font-medium text-slate-600 shadow-xl shadow-purple-900/5"
          >
            <li><Link to="/" className="hover:bg-purple-50 hover:text-purple-600">Home</Link></li>
            <li><Link to="/signup" className="hover:bg-purple-50 hover:text-purple-600">Signup</Link></li>
            <li><Link to="/login" className="font-semibold text-purple-700 hover:bg-purple-50 hover:text-purple-800">Login</Link></li>
          </ul>
        </div>
      </div>
      
    </div>
  );
}

export default Navbar;