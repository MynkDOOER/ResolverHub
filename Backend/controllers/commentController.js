import { comment, getComments } from "../services/commentService.js";

export const create = async (req, res) => {
	try {
		console.log(req.body);
		const createdComment = await comment(req.body, req.id);
		res.status(201).json({
			success: true,
			message: "Sent Successfully",
			createdComment,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const get = async (req, res) => {
	try {
		const comments = await getComments(req.params.bugId, req.id);
		res.status(200).json({
			success: true,
			message: "Comments fetched Successfully",
			comments,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};
