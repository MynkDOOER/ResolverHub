import { useState } from "react";

const RequestCard = ({ request, onAccept, onReject }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  return (
    <div className="card bg-base-100 shadow-xl border">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="card-title text-2xl">{request.senderId?.name}</h2>

            <p className="text-base-content/70">{request.senderId?.email}</p>

            <p className="mt-3">Wants to join your company.</p>

            <p className="text-sm opacity-60 mt-2">
              Requested on {new Date(request.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="badge badge-warning badge-lg">Pending</div>
        </div>

        <div className="card-actions justify-end mt-6">
          <button
            className="btn btn-error"
            disabled={isProcessing}
            onClick={() => {
              setIsProcessing(true);
              onReject(request._id);
            }}
          >
            {isProcessing ? "Processing..." : "Reject"}
          </button>

          <button
            className="btn btn-success"
            disabled={isProcessing}
            onClick={() => {
              setIsProcessing(true);
              onAccept(request._id);
            }}
          >
            {isProcessing ? "Processing..." : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
