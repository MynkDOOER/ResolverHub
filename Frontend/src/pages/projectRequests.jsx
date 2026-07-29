import { useEffect, useState } from "react";
import {
  fetchProjectRequests,
  acceptRequest,
  denyRequest,
} from "../api/notificationApi";

const ProjectRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State to hold the selected role for each request (defaults to 'Developer')
  const [selectedRoles, setSelectedRoles] = useState({});

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchProjectRequests();
        setRequests(data);
        
        // Initialize default dropdown values to 'Developer'
        const initialRoles = {};
        data.forEach(req => {
            initialRoles[req._id] = "Developer";
        });
        setSelectedRoles(initialRoles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  const handleRoleChange = (requestId, role) => {
      setSelectedRoles(prev => ({ ...prev, [requestId]: role }));
  };

  const handleAccept = async (notificationId) => {
    try {
      const assignedRole = selectedRoles[notificationId];
      await acceptRequest(notificationId, assignedRole);

      setRequests((prev) =>
        prev.filter((request) => request._id !== notificationId),
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (notificationId) => {
    try {
      await denyRequest(notificationId);

      setRequests((prev) =>
        prev.filter((request) => request._id !== notificationId),
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8" style={{ fontFamily: "'Fira Code', monospace" }}>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Project Join Requests</h1>

      {error && (
        <div className="alert alert-error mb-5 text-sm">
          <span>{error}</span>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 mb-4">
             <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">No Pending Requests</h2>
          <p className="mt-2 text-sm text-gray-500">Your project workspace is fully managed.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div key={request._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              
              <div className="mb-4 sm:mb-0">
                <h3 className="font-semibold text-lg text-gray-900">
                    {request.senderId?.name || "Unknown User"}
                </h3>
                <p className="text-sm text-gray-500">{request.senderId?.email || "No email"}</p>
                <p className="text-xs text-gray-400 mt-1">Requested to join this project</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Dropdown for selecting role */}
                <select 
                    className="select select-bordered select-sm w-full sm:w-36 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    value={selectedRoles[request._id] || "Developer"}
                    onChange={(e) => handleRoleChange(request._id, e.target.value)}
                >
                    <option value="Developer">Developer</option>
                    <option value="Tester">Tester</option>
                </select>

                <button 
                    onClick={() => handleAccept(request._id)}
                    className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                >
                    Accept
                </button>
                <button 
                    onClick={() => handleReject(request._id)}
                    className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50"
                >
                    Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectRequests;