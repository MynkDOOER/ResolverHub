import React, { useState } from 'react';
import toast from 'react-hot-toast';

const BugModal = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSubmit({ title, description, priority });
            toast.success("Bug reported successfully!");
            // Reset form
            setTitle('');
            setDescription('');
            setPriority('Medium');
            onClose();
        } catch (error) {
            toast.error(error.message || "Failed to report bug");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Report a New Bug</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bug Title</label>
                        <input 
                            type="text" 
                            required
                            className="input input-bordered w-full" 
                            placeholder="e.g., Login button unresponsive"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                            required
                            className="textarea textarea-bordered w-full h-24" 
                            placeholder="Steps to reproduce, expected behavior, etc."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select 
                            className="select select-bordered w-full"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn bg-orange-600 hover:bg-orange-700 text-white" disabled={isLoading}>
                            {isLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Submit Bug'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BugModal;