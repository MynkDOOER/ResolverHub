import Comment from "../models/commentModel.js";

export const createComment = async (commentData) => {
	return await Comment.create(commentData);
};

export const findCommentsByBugId = async (bugId) => {
	return await Comment.find({ bugId });
};
