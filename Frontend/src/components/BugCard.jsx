import React from 'react';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

const BugCard = ({ bug }) => {
    // Dynamic styling for priority badges
    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'Critical': 
                return 'bg-red-50 text-red-700 border-red-200';
            case 'High': 
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'Medium': 
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Low': 
                return 'bg-gray-50 text-gray-700 border-gray-200';
            default: 
                return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    // Dynamic status styling
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Open':
                return <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100"><Clock size={12} /> Open</span>;
            case 'InProgress':
                return <span className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100"><AlertCircle size={12} /> In Progress</span>;
            case 'Resolved':
                return <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100"><CheckCircle2 size={12} /> Resolved</span>;
            case 'Closed':
                return <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">Closed</span>;
            default:
                return <span className="text-xs text-gray-500">{status}</span>;
        }
    };

    return (
        <div 
            className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:border-red-300 hover:shadow-md"
            style={{ fontFamily: "'Fira Code', monospace" }}
        >
            <div>
                {/* Top Row: Title & Priority Badge */}
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-bold text-gray-900 transition-colors group-hover:text-red-600 line-clamp-1">
                        {bug.title}
                    </h3>
                    <span className={`shrink-0 rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getPriorityStyles(bug.priority)}`}>
                        {bug.priority}
                    </span>
                </div>

                {/* Bug Description */}
                <p className="mt-2.5 text-xs leading-relaxed text-gray-500 line-clamp-2">
                    {bug.description || "No description provided for this bug."}
                </p>
            </div>

            {/* Bottom Row: Metadata & Status */}
            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-[11px] text-gray-400">
                    ID: <span className="text-gray-600">#{bug._id?.slice(-6)}</span>
                </span>
                <div>
                    {getStatusBadge(bug.status)}
                </div>
            </div>
        </div>
    );
};

export default BugCard;