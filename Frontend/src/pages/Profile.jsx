import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../stores/authStore";

const Profile_API = "http://localhost:5000/api/profile";

import {
  User,
  Mail,
  Shield,
  Pencil,
  X,
  Save,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

const ROLE_STYLES = {
  Admin: "bg-purple-100 text-purple-700",
  ProjectAdmin: "bg-blue-100 text-blue-700",
  Developer: "bg-emerald-100 text-emerald-700",
  Tester: "bg-amber-100 text-amber-700",
  Unassigned: "bg-slate-100 text-slate-600",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition duration-200 ease-in-out hover:border-purple-200 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-600/10";

export default function Profile() {
  const refreshUser = useAuthStore((state) => state.refreshUser);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "Unassigned",
  });
  const [loading, setLoading] = useState(true);

  // Name edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
   const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Using standard fetch instead of the undefined apiFetch
        const response = await fetch(`${Profile_API}/me`, {
          method: "GET", // Changed from POST to GET (standard for /me endpoints)
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch profile");
        }

        const data = await response.json();
        setProfile({ name: data.name, email: data.email, role: data.role });
        setEditName(data.name);
      } catch (error) {
        toast.error(error.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    
    try {
      setSavingName(true);
      const response = await fetch(`${Profile_API}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update name");
      }

      const data = await response.json();
      
      const updated = {
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
      };
      
      setProfile(updated);
      refreshUser({ name: data.data.name });
      setIsEditing(false);
      toast.success("Name updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

   const handleCancelEdit = () => {
    setEditName(profile.name);
    setIsEditing(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    try {
      setSavingPassword(true);
      const response = await fetch(`${Profile_API}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600" />
          <p
            className="text-sm text-slate-500"
            style={{ fontFamily: "'Fira Code', monospace" }}
          >
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const roleStyle = ROLE_STYLES[profile.role] || ROLE_STYLES.Unassigned;
  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : "U";

  return (
    <div
      className="min-h-screen bg-slate-50 p-4 sm:p-8"
      style={{ fontFamily: "'Fira Code', monospace" }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your account information and password.
          </p>
        </div>

        {/* ── Profile Card ── */}
        <div className="rounded-2xl border border-purple-200 bg-white p-6 sm:p-8 shadow-xl shadow-purple-900/5">
          {/* Card header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-slate-700">
              <User className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Profile Details
              </span>
            </div>
            {!isEditing && (
              <button
                id="btn-edit-profile"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-purple-600 hover:bg-purple-50 transition duration-200"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
          </div>

          {/* Avatar + info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="w-20 h-20 shrink-0 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-purple-600/20">
              {initial}
            </div>

            {isEditing ? (
              <form
                id="form-edit-name"
                onSubmit={handleSaveName}
                className="flex-1 w-full space-y-3"
              >
                <div>
                  <label
                    htmlFor="edit-name"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Full Name
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    disabled={savingName}
                    className={inputClass}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    id="btn-save-name"
                    disabled={savingName}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 transition duration-200 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-xl disabled:pointer-events-none disabled:opacity-50"
                  >
                    {savingName ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {savingName ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    id="btn-cancel-edit"
                    onClick={handleCancelEdit}
                    disabled={savingName}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition duration-200 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-slate-900">
                  {profile.name}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">{profile.email}</p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${roleStyle}`}
                >
                  {profile.role}
                </span>
              </div>
            )}
          </div>

          {/* Info rows (view mode only) */}
          {!isEditing && (
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-purple-400 shrink-0" />
                <span className="text-slate-500 w-14 shrink-0 text-xs uppercase tracking-wider font-semibold">
                  Email
                </span>
                <span className="text-slate-800 font-medium truncate">
                  {profile.email}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-purple-400 shrink-0" />
                <span className="text-slate-500 w-14 shrink-0 text-xs uppercase tracking-wider font-semibold">
                  Role
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleStyle}`}
                >
                  {profile.role}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Change Password Card ── */}
        <div className="rounded-2xl border border-purple-200 bg-white p-6 sm:p-8 shadow-xl shadow-purple-900/5">
          <div className="flex items-center gap-2 mb-6">
            <KeyRound className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Change Password
            </span>
          </div>

          <form
            id="form-change-password"
            onSubmit={handleChangePassword}
            className="space-y-4"
          >
            {/* Current password */}
            <div>
              <label
                htmlFor="old-password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  id="old-password"
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  disabled={savingPassword}
                  placeholder="••••••••"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-purple-600 transition"
                >
                  {showOld ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label
                htmlFor="new-password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={savingPassword}
                  placeholder="Min. 6 characters"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-purple-600 transition"
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm new password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={savingPassword}
                  placeholder="Re-enter new password"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-purple-600 transition"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1.5 text-xs font-semibold text-red-500">
                  Passwords do not match.
                </p>
              )}
            </div>

            <button
              type="submit"
              id="btn-change-password"
              disabled={savingPassword}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 transition duration-200 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-xl disabled:pointer-events-none disabled:opacity-50"
            >
              {savingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
