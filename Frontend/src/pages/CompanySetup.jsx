import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

const SetupWorkspace = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [inviteCode, setInviteCode] = useState("");

  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const user = useAuthStore((state) => state.user);

  const HEX_REGEX = /^[0-9A-Fa-f]{8}$/;

  const handleCreateChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create company");
      }

      toast.success("Workspace created successfully!");
      console.log("Invite Code:", data.data.company.inviteCode);
      refreshUser(data.data.updatedUser);
      navigate("/company/projects");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      if (!HEX_REGEX.test(inviteCode)) {
        throw new Error("Invite code must be an 8-digit hexadecimal string");
      }

      const response = await fetch(
        "http://localhost:5000/api/notifications/company/join",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ inviteCode }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send request");
      }

      toast.success("Join Request Sent!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col bg-slate-50 antialiased"
      style={{ fontFamily: "'Fira Code', monospace" }}
    >
      <div className="shrink-0 pb-4 pt-8 text-center md:pb-8 md:pt-10">
        <h1 className="whitespace-pre-line text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {`Hi ${user?.name || "User"}\nSetup Your Workspace`}
        </h1>
      </div>

      {/* Scroll Snap Container for Mobile / Standard Flex for Desktop */}
      <div className="flex-1 snap-y snap-mandatory overflow-y-auto md:snap-none md:overflow-visible">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 md:min-h-full md:flex-row md:items-stretch md:py-8">
          {/* ===== CREATE COMPANY SECTION ===== */}
          <div className="relative flex min-h-[calc(100vh-140px)] w-full max-w-md shrink-0 snap-center flex-col justify-center py-12 md:min-h-0 md:py-0">
            <form onSubmit={handleCreateSubmit} className="w-full">
              <div className="rounded-2xl border border-purple-200 bg-white p-8 shadow-xl shadow-purple-900/5">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Create a Workspace
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Enter your company details below to get started
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleCreateChange}
                      required
                      disabled={loading}
                      placeholder="ResolverHub Inc."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition duration-200 ease-in-out hover:border-purple-200 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-600/10 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Company Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleCreateChange}
                      required
                      disabled={loading}
                      placeholder="contact@company.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition duration-200 ease-in-out hover:border-purple-200 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-600/10 disabled:opacity-60"
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
                          <svg
                            className="h-4 w-4 animate-spin text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Create Company"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* ===== DESKTOP 'OR' BADGE ===== */}
          <div className="hidden flex-col items-center justify-center md:mx-8 md:flex">
            <div className="h-40 w-px bg-slate-200"></div>
            <div className="py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              OR
            </div>
            <div className="h-40 w-px bg-slate-200"></div>
          </div>

          {/* ===== JOIN COMPANY SECTION ===== */}
          <div className="relative flex min-h-[calc(100vh-140px)] w-full max-w-md shrink-0 snap-center flex-col justify-start py-12 md:min-h-0 md:justify-center md:py-0">
            {/* MOBILE 'OR' BADGE */}
            <div className="mb-8 flex w-full items-center justify-center md:hidden">
              <div className="h-px w-20 bg-slate-200"></div>
              <div className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                OR
              </div>
              <div className="h-px w-20 bg-slate-200"></div>
            </div>

            <form onSubmit={handleJoinSubmit} className="w-full">
              <div className="rounded-2xl border border-purple-200 bg-white p-8 shadow-xl shadow-purple-900/5">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Join a Workspace
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Enter your company invite code below
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Invite Code / Access Token
                    </label>
                    <input
                      type="text"
                      name="inviteCode"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="e.g. 0000FFFF"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition duration-200 ease-in-out hover:border-purple-200 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-600/10 disabled:opacity-60"
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
                          <svg
                            className="h-4 w-4 animate-spin text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Join Workspace"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupWorkspace;
