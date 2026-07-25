import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup Failed");
      }
      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 antialiased"
     style={{ fontFamily: "'Fira Code', monospace" }}>
  <form onSubmit={handleSubmit} className="w-full max-w-md">
    {/* Card Container with Theme-Matched Border */}
    <div className="rounded-2xl border border-purple-200 bg-white p-8 shadow-xl shadow-purple-900/5">
      
 
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Create an Account
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Enter your details below to get started
        </p>
      </div>

      <div className="space-y-5">
      
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Full Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition duration-200 ease-in-out hover:border-purple-200 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-600/10"
          />
        </div>

        
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition duration-200 ease-in-out hover:border-purple-200 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-600/10"
          />
        </div>

     
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition duration-200 ease-in-out hover:border-purple-200 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-600/10"
          />
        </div>

       
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center rounded-xl bg-purple-600 px-10 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 transition duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-600/40 active:translate-y-0 active:bg-purple-800 active:shadow-md disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Registering...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
      </div>

    </div>
  </form>
</div>
    </>
  );
};

export default Signup;
