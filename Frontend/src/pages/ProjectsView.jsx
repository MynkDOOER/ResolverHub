import toast from "react-hot-toast";
import { fetchAllProjects, createNewProject, deleteProjectById } from "../api/projectApi";
import useAuthStore from "../stores/authStore";
import { useEffect, useState } from "react";

const ProjectsView = () => {
  const { user, token } = useAuthStore(); 
  
  const isCompanyAdmin = user?.role === "Admin" || user?.role === "Company Admin";
  const hasCompany = Boolean(user?.companyId); 

  const [projects, setProjects] = useState([]);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newProject, setNewProject] = useState({ 
    name: "", 
    description: "", 
    projectAdminId: "" 
  });

  // Fetch Projects & Unassigned Users
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllProjects();
        setProjects(data);

        // Fetch company users for assignment if user is Admin
        if (isCompanyAdmin && hasCompany) {
          const res = await fetch("http://localhost:5000/api/company/members", {
            headers: { Authorization: `Bearer ${token}` }
          });
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
  }, [isCompanyAdmin, hasCompany, token]);

  // Filter unassigned users for Project Admin selection
  const unassignedUsers = companyUsers.filter((u) => !u.currentProjectId && u._id !== user?._id);

  const handleCreateSubmit = async (e) => {
    e.preventDefault(); 
    if (!newProject.name) return toast.error("Project name is required");

    const toastId = toast.loading("Creating project...");
    try {
      const result = await createNewProject(newProject);
      setProjects([...projects, result.data || result]); 
      toast.success("Project created successfully!", { id: toastId });
      
      setNewProject({ name: "", description: "", projectAdminId: "" });
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to create project", { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    const toastId = toast.loading("Deleting project...");
    try {
      await deleteProjectById(id);
      setProjects(projects.filter((p) => p._id !== id));
      toast.success("Project deleted successfully", { id: toastId });
    } catch (error) {
      toast.error(error.message || "Failed to delete project", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#090D16] text-[#E5383B] font-['Fira_Code']">
        Loading Projects...
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-[#090D16] p-8 text-slate-100"
      style={{ fontFamily: "'Fira Code', monospace" }}
    >
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Projects</h1>
          <p className="mt-1 text-xs text-slate-400">Manage and monitor all active workspaces</p>
        </div>
        
        {isCompanyAdmin && (
          <button 
            onClick={() => {
              if (!hasCompany) {
                toast.error("You must create or join a company first!");
                return;
              }
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-[#CD1C18] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#b01714] shadow-lg shadow-red-950/40"
          >
            + New Project
          </button>
        )}
      </div>

      {/* PROJECT GRID */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-500">
          No active projects found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div 
              key={project._id} 
              className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl transition-all hover:border-slate-700 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white group-hover:text-[#E5383B] transition-colors">
                    {project.name}
                  </h2>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 border border-slate-700">
                    Active
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-400 line-clamp-3">
                  {project.description || "No description provided for this project."}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-800/80 pt-4">
                <button className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                  View Bugs
                </button>
                
                {isCompanyAdmin && (
                  <button 
                    onClick={() => handleDelete(project._id)} 
                    className="rounded-lg bg-red-950/60 border border-red-800/50 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-900/80 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL (FIXED BACKDROP) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#090D16] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#CD1C18]"></span>
                Create New Project
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name</label>
                <input 
                  type="text" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g., ResolverHub Frontend" 
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#CD1C18] focus:outline-none focus:ring-1 focus:ring-[#CD1C18]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea 
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="What is this project about?" 
                  rows={3}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#CD1C18] focus:outline-none focus:ring-1 focus:ring-[#CD1C18]"
                />
              </div>

              {/* Assign Project Admin Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assign Project Admin <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <select
                  value={newProject.projectAdminId}
                  onChange={(e) => setNewProject({ ...newProject, projectAdminId: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white focus:border-[#CD1C18] focus:outline-none focus:ring-1 focus:ring-[#CD1C18]"
                >
                  <option value="">Select an unassigned member...</option>
                  {unassignedUsers.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="rounded-lg bg-[#CD1C18] px-4 py-2 text-xs font-semibold text-white hover:bg-[#b01714] shadow-md shadow-red-950/40"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsView;