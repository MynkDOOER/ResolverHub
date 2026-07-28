import { useEffect, useState } from "react";
import {
  fetchCompanyRequests,
  acceptRequest,
  denyRequest,
} from "../api/notificationApi";
import RequestCard from "../components/requestCard";

const CompanyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchCompanyRequests();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleAccept = async (notificationId) => {
    try {
      await acceptRequest(notificationId);

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
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Company Join Requests</h1>

      {error && (
        <div className="alert alert-error mb-5">
          <span>{error}</span>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="hero bg-base-200 rounded-xl">
          <div className="hero-content text-center">
            <div>
              <h2 className="text-3xl font-bold">🎉 No Pending Requests</h2>

              <p className="mt-2 opacity-70">Everyone has been reviewed.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyRequests;
