import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

const COMMENTS_PER_PAGE = 5;

const ProjectBugView = () => {
	const { bugId } = useParams();

	const token = useAuthStore((state) => state.token);
	const currentUserRole = useAuthStore((state) => state.user.role);

	const [bug, setBug] = useState(null);
	const [allComments, setAllComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchBugDetails = async () => {
			try {
				const response = await fetch(
					`http://localhost:5000/api/bugs/${bugId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);
				const data = await response.json();
				setBug(data.data);
			} catch (error) {
				toast.error(error.message);
			}
		};
		fetchBugDetails();
	}, [bugId, token]);

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const response = await fetch(
					`http://localhost:5000/api/comments/${bugId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);
				const data = await response.json();

				setAllComments(data.comments);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		if (bugId) fetchComments();
	}, [bugId, token]);

	// Derive visible comments based on the current page
	const visibleComments = allComments.slice(0, page * COMMENTS_PER_PAGE);
	const hasMoreComments = visibleComments.length < allComments.length;

	const handlePostComment = async () => {
		if (newComment.trim().length == 0) {
			toast.error("Comment can't be empty");
			return;
		}
		try {
			const response = await fetch("http://localhost:5000/api/comments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
					body: JSON.stringify({ bugId, text: newComment }),
				},
			});
			const data = await response.json();

			setAllComments((prev) => [...prev, data.createdComment]);
			toast.success("Comment Sent Successfully");
		} catch (error) {
			toast.error(error.message);
		}

		// Example Optimistic UI update (shows comment immediately without refreshing)
		/*
    const newCommentObj = {
      _id: Date.now().toString(),
      text: newComment,
      senderId: { name: "Current User" }, // Replace with actual user info
      createdAt: new Date().toISOString()
    };
    setAllComments([...allComments, newCommentObj]);
    */

		setNewComment("");
	};

	const handleStatusChange = async (newStatus) => {
		console.log("Changing status to:", newStatus);
		// TODO: Add your PUT/PATCH API call here
	};

	const handlePriorityChange = async (e) => {
		const newPriority = e.target.value;
		console.log("Changing priority to:", newPriority);
		// TODO: Add your PUT/PATCH API call here
	};

	if (loading || !bug) {
		return (
			<div className="flex justify-center items-center h-screen">
				<span className="loading loading-spinner loading-lg"></span>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto p-6 space-y-8">
			{/* BUG DETAILS SECTION */}
			<section className="bg-base-100 shadow-xl rounded-box p-6 border border-base-200">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div className="flex-1">
						<h1 className="text-3xl font-bold mb-3">{bug.title}</h1>
						<div className="flex items-center gap-3">
							<div className="avatar placeholder">
								<div className="bg-neutral text-neutral-content rounded-full w-10">
									<span className="text-xl uppercase">
										{bug.reportedBy?.name?.charAt(0) || "U"}
									</span>
								</div>
							</div>
							<div className="flex flex-col">
								<span className="font-semibold">
									{bug.reportedBy?.name || "Unknown User"}
								</span>
								<span className="text-xs text-base-content/70">
									Reported on{" "}
									{new Date(bug.createdAt).toLocaleString()}
								</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col items-end gap-3">
						<div className="flex items-center gap-2">
							<span className="text-sm font-semibold text-base-content/70 uppercase tracking-wide">
								Status:
							</span>
							<div className="badge badge-primary badge-lg">
								{bug.status}
							</div>
						</div>

						<div className="flex flex-wrap justify-end gap-2 mt-2">
							{currentUserRole === "developer" && (
								<>
									<button
										onClick={() =>
											handleStatusChange("inprogress")
										}
										className="btn btn-sm btn-warning"
									>
										Mark In-Progress
									</button>
									<button
										onClick={() =>
											handleStatusChange("resolved")
										}
										className="btn btn-sm btn-success"
									>
										Mark Resolved
									</button>
								</>
							)}

							{currentUserRole === "tester" && (
								<>
									<button
										onClick={() =>
											handleStatusChange("open")
										}
										className="btn btn-sm btn-info"
									>
										Mark Open
									</button>
									<button
										onClick={() =>
											handleStatusChange("closed")
										}
										className="btn btn-sm btn-error"
									>
										Mark Closed
									</button>
								</>
							)}

							{(currentUserRole === "tester" ||
								currentUserRole === "admin") && (
								<select
									className="select select-bordered select-sm"
									defaultValue={bug.priority}
									onChange={handlePriorityChange}
								>
									<option disabled>Change Priority</option>
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
									<option value="critical">Critical</option>
								</select>
							)}
						</div>
					</div>
				</div>

				<div className="divider"></div>
				<div className="prose max-w-none">
					<h3 className="text-lg font-semibold mb-2">Description</h3>
					<p className="whitespace-pre-wrap text-base-content/80">
						{bug.description}
					</p>
				</div>
			</section>

			{/* COMMENTS SECTION */}
			<section className="bg-base-100 shadow-xl rounded-box p-6 border border-base-200">
				<h2 className="text-2xl font-bold mb-6">Comments</h2>

				<div className="flex flex-col gap-3 mb-8">
					<textarea
						className="textarea textarea-bordered w-full"
						placeholder="Write a comment..."
						rows="3"
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
					></textarea>
					<div className="flex justify-end">
						<button
							className="btn btn-primary"
							onClick={handlePostComment}
							disabled={!newComment.trim()}
						>
							Post Comment
						</button>
					</div>
				</div>

				<div className="space-y-4">
					{visibleComments.length === 0 ? (
						<p className="text-center text-base-content/50 italic">
							No comments yet.
						</p>
					) : (
						visibleComments.map((comment) => (
							<div key={comment._id} className="chat chat-start">
								<div className="chat-image avatar placeholder">
									<div className="bg-neutral text-neutral-content rounded-full w-10">
										<span className="uppercase">
											{comment.senderId?.name?.charAt(
												0,
											) || "U"}
										</span>
									</div>
								</div>
								<div className="chat-header mb-1">
									{comment.senderId?.name || "Unknown"}
								</div>
								<div className="chat-bubble chat-bubble-base-200 text-base-content">
									{comment.text}
								</div>
								<div className="chat-footer opacity-50 mt-1 text-xs">
									{new Date(
										comment.createdAt,
									).toLocaleString()}
								</div>
							</div>
						))
					)}
				</div>

				{/* Frontend Pagination Logic */}
				{hasMoreComments && (
					<div className="flex justify-center mt-8">
						<button
							className="btn btn-outline btn-wide"
							onClick={() => setPage((prev) => prev + 1)}
						>
							Load More (
							{allComments.length - visibleComments.length}{" "}
							remaining)
						</button>
					</div>
				)}
			</section>
		</div>
	);
};

export default ProjectBugView;
