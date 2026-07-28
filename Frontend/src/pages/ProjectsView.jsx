import toast from "react-hot-toast";
import {
  fetchAllProjects,
  createNewProject,
  deleteProjectById,
} from "../api/projectApi";
import useAuthStore from "../stores/authStore";
import { useEffect, useState } from "react";
import { Plus, Folder, Trash2, Bug, X, Activity } from "lucide-react";

const ProjectsView = () => {
  const { user, token } = useAuthStore();
  const isCompanyAdmin = user?.role === "Admin";

  const [projects, setProjects] = useState([]);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    projectAdminId: "",
  });

  // Fetch Projects & Unassigned Users
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllProjects();
        setProjects(data);

        // Fetch company users for assignment if user is Admin
        if (isCompanyAdmin) {
          const res = await fetch(
            "http://localhost:5000/api/company/free-members",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (res.ok) {
            const members = await res.json();
            setCompanyUsers(members.data || members);
          }
        }
      } catch (error) {
        toast.error(error.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isCompanyAdmin, token]);

  // Filter unassigned users for Project Admin selection
  const unassignedUsers = companyUsers.filter(
    (u) => !u.projectId && u._id !== user?._id,
  );

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const toastid = toast.loading("Creating project...");

    try {
      if (!newProject.projectAdminId) {
        toast.dismiss(toastid);
        return toast.error("Please assign a Project Admin.");
      }
      const result = await createNewProject(newProject);

      setProjects([...projects, result.data.projectCreated]);
      toast.dismiss(toastid);
      toast.success("Project created successfully!");

      setCompanyUsers((prev) =>
        prev.filter(
          (user) =>
            user._id.toString() !== result.data.updatedUser._id.toString(),
        ),
      );
      setNewProject({ name: "", description: "", projectAdminId: "" });
      setIsModalOpen(false);
    } catch (error) {
      toast.dismiss(toastid);
      toast.error(error.message || "Failed to create project");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    const toastid = toast.loading("Deleting project...");
    try {
      await deleteProjectById(id);
      setLoading(true);
      const res = await fetch(
        "http://localhost:5000/api/company/free-members",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const members = await res.json();
        setCompanyUsers(members.data || members);
      }

      setProjects(projects.filter((p) => p._id !== id));
      toast.dismiss(toastid);
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="flex h-screen items-center justify-center bg-gray-50"
        style={{ fontFamily: "'Fira Code', monospace" }}
      >
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <Activity className="h-8 w-8 animate-pulse text-red-500" />
          <p className="text-sm font-medium animate-pulse">Loading Projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50/50 p-6 md:p-10"
      style={{ fontFamily: "'Fira Code', monospace" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Projects
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor all active workspaces
            </p>
          </div>

          {isCompanyAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex w-fit items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-200 transition-all hover:opacity-90 active:scale-95"
            >
              <Plus size={18} className="transition-transform group-hover:rotate-90" />
              New Project
            </button>
          )}
        </div>

        {/* PROJECT GRID */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Folder size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No projects yet</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              Get started by creating a new project to start tracking bugs and collaborating with your team.
            </p>
            {isCompanyAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 font-medium text-red-600 hover:text-red-700 hover:underline"
              >
                Create your first project →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-red-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-red-600 line-clamp-1">
                      {project.name}
                    </h2>
                    <span className="shrink-0 rounded-md border border-red-100 bg-red-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700">
                      Active
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-gray-500 line-clamp-3">
                    {project.description ||
                      "No description provided for this project."}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                  <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700">
                    <Bug size={14} />
                    View Bugs
                  </button>

                  {isCompanyAdmin && (
                    <button
                      onClick={() => handleDelete(project._id)}
                      title="Delete Project"
                      className="flex items-center justify-center rounded-lg border border-red-100 bg-white px-2 py-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL (FIXED BACKDROP) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm transition-opacity">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200 rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl space-y-5">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-sm shadow-red-200">
                    <Plus size={14} />
                  </span>
                  Create New Project
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                    placeholder="e.g., ResolverHub Frontend"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    placeholder="What is this project about?"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* Assign Project Admin Dropdown */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Assign Project Admin
                  </label>
                  <select
                    value={newProject.projectAdminId}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        projectAdminId: e.target.value,
                      })
                    }
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="" disabled className="text-gray-400">
                      Select an unassigned member...
                    </option>
                    {unassignedUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-red-200 transition-all hover:opacity-90 active:scale-95"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsView;