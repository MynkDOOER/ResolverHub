import { useState } from "react";

const RequestCard = ({ request, onAccept, onReject }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Safely grab initials for the avatar placeholder
  const initials = request.senderId?.name
    ? request.senderId.name.substring(0, 2).toUpperCase()
    : "??";

  // Format date cleaner (e.g., "Oct 12, 2023, 10:30 AM")
  const formattedDate = new Date(request.createdAt).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-200 border border-base-200">
      <div className="card-body p-5 sm:p-6">
        {/* Header: Avatar, Info, and Badge */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar Placeholder */}
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-12 h-12 shadow-inner">
                <span className="text-lg font-semibold">{initials}</span>
              </div>
            </div>

            {/* Sender Details */}
            <div>
              <h2 className="card-title text-lg sm:text-xl text-base-content">
                {request.senderId?.name || "Unknown User"}
              </h2>
              <p className="text-sm text-base-content/60 font-medium">
                {request.senderId?.email || "No email provided"}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="badge badge-warning gap-1.5 font-medium px-3 py-3 rounded-md bg-warning/20 text-warning-content border-none">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
            Pending
          </div>
        </div>

        {/* Request Context Well */}
        <div className="mt-5 bg-base-200/50 rounded-lg p-4">
          <p className="text-sm text-base-content/80 font-medium flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Wants to join your company
          </p>
          <p className="text-xs text-base-content/50 mt-2 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Requested on {formattedDate}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-6 gap-3">
          <button
            className="btn btn-outline btn-error btn-sm sm:btn-md"
            disabled={isProcessing}
            onClick={async () => {
              setIsProcessing(true);
              await onReject(request._id);
              setIsProcessing(false); // Only needed if component doesn't immediately unmount
            }}
          >
            {isProcessing ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            Reject
          </button>

          <button
            className="btn btn-success text-white btn-sm sm:btn-md shadow-sm"
            disabled={isProcessing}
            onClick={async () => {
              setIsProcessing(true);
              await onAccept(request._id);
              setIsProcessing(false);
            }}
          >
            {isProcessing ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
