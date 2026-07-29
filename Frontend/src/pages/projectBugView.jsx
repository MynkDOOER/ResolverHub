import { useEffect, useState } from "react";
import useAuthStore from "../stores/authStore";
import { fetchAllBugs, createNewBug } from "../api/bugsApi";
import { fetchProjectUnassignedMembers } from "../api/projectApi";
import {
  fetchCompanyRequests,
  acceptRequest,
  denyRequest,
} from "../api/notificationApi";
import BugModal from "../components/BugModal";
import BugCard from "../components/BugCard"; // 👈 Import the BugCard component

const ProjectBugView = () => {
  const { user } = useAuthStore(); 

  const [bugs, setBugs] = useState([]);
  const [unassignedMembers, setUnassignedMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const isProjectAdmin = user?.role === "ProjectAdmin";

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const bugsData = await fetchAllBugs(user?.projectId);
        // Ensure we filter out any null/undefined results
        setBugs(Array.isArray(bugsData) ? bugsData.filter(Boolean) : []);

        if (isProjectAdmin) {
          const membersData = await fetchProjectUnassignedMembers();
          setUnassignedMembers(membersData);

          const requestsData = await fetchCompanyRequests();
          setRequests(requestsData);
        }
      } catch (error) {
        console.error("Failed to load project data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.projectId) {
      loadData();
    }
  }, [isProjectAdmin, user?.projectId]);

  const handleAcceptRequest = async (id, assignedRole) => {
    try {
      await acceptRequest(id, { role: assignedRole });
      setRequests(requests.filter((req) => req._id !== id));
    } catch (error) {
      console.error("Failed to accept request:", error.message);
    }
  };

  const handleDenyRequest = async (id) => {
    try {
      await denyRequest(id);
      setRequests(requests.filter((req) => req._id !== id));
    } catch (error) {
      console.error("Failed to deny request:", error.message);
    }
  };

  const handleBugSubmit = async (bugData) => {
    try {
      const payload = {
        ...bugData,
        projectId: user.projectId, 
        companyId: user.companyId
      };
      
      const response = await createNewBug(payload);
      
      // Safeguard: Check if response.bug exists before adding it
      if (response && response.bug) {
        setBugs((prevBugs) => [response.bug, ...prevBugs]);
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to report bug:", error.message);
      throw error; 
    }
  };

  if (loading)
    return <div className="p-8 text-center">Loading project data...</div>;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-gray-50/30 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Project Workspace
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage bugs and oversee project members
          </p>
        </div>

        {user?.role === "Tester" && (
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="btn btn-primary bg-orange-600 hover:bg-orange-700 text-white border-none shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Report Bug
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h2 className="text-lg font-semibold text-gray-700">Active Bugs</h2>
            <span className="badge badge-neutral">{bugs.length}</span>
          </div>

          {bugs.filter(Boolean).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-400">
                No bugs reported yet. Clean slate!
              </p>
            </div>
          ) : (
            bugs.filter(Boolean).map((bug) => (
              // 👈 Using the modular BugCard component here
              <BugCard key={bug._id} bug={bug} />
            ))
          )}
        </div>

        {isProjectAdmin && (
          <div className="space-y-6">
            <div className="card bg-white shadow-sm border border-gray-100">
              <div className="card-body p-5">
                <h2 className="text-md font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-3">
                  Unassigned Members
                </h2>
                {unassignedMembers.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    All members have assigned roles.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {unassignedMembers.map((member) => (
                      <li
                        key={member._id}
                        className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span className="font-medium text-gray-600">
                          {member.name}
                        </span>
                        <button className="btn btn-xs btn-outline border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800">
                          Assign
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="card bg-white shadow-sm border border-gray-100">
              <div className="card-body p-5">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
                  <h2 className="text-md font-semibold text-gray-700">
                    Join Requests
                  </h2>
                  {requests.length > 0 && (
                    <span className="badge bg-orange-100 text-orange-700 border-none badge-sm">
                      {requests.length}
                    </span>
                  )}
                </div>

                {requests.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    No pending requests.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {requests.map((request) => (
                      <li
                        key={request._id}
                        className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                      >
                        <div className="font-medium text-sm text-gray-700 mb-3">
                          {request.user?.name || "User"}{" "}
                          <span className="text-gray-400 font-normal">
                            wants to join
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleAcceptRequest(request._id, "Developer")
                            }
                            className="btn btn-xs bg-emerald-500 hover:bg-emerald-600 border-none text-white flex-1"
                          >
                            Dev
                          </button>
                          <button
                            onClick={() =>
                              handleAcceptRequest(request._id, "Tester")
                            }
                            className="btn btn-xs bg-blue-500 hover:bg-blue-600 border-none text-white flex-1"
                          >
                            Tester
                          </button>
                          <button
                            onClick={() => handleDenyRequest(request._id)}
                            className="btn btn-xs btn-ghost text-red-500 hover:bg-red-50 px-2"
                          >
                            Reject
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <BugModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleBugSubmit} 
      />
    </div>
  );
};

export default ProjectBugView;