import { findBugById } from "../repositories/bugRepository.js";
import {
	createComment,
	findCommentsByBugId,
} from "../repositories/commentRepository.js";
import { findCompanyById } from "../repositories/companyRepository.js";
import { findProjectById } from "../repositories/projectRepository.js";
import { findUserById } from "../repositories/userRepository.js";

export const comment = async (commentData, userId) => {
	const user = await findUserById(userId);
	if (!user) {
		throw new Error("User Not Found");
	}

	const bug = await findBugById(commentData.bugId);
	if (!bug) {
		throw new Error("Bug Not Found");
	}

	const project = await findProjectById(bug.projectId);
	if (!project) {
		throw new Error("Project Not Found");
	}

	if (user.projectId?.toString() !== project._id?.toString()) {
		throw new Error("You are not a part of this project");
	}

	const company = await findCompanyById(project.companyId);
	if (!company) {
		throw new Error("Company Not Found");
	}

	if (user.companyId?.toString() !== company._id?.toString()) {
		throw new Error("You are not a part of this company");
	}

	return await createComment({
		senderId: userId,
		projectId: project._id,
		companyId: company._id,
		...commentData,
	});
};

export const getComments = async (bugId, userId) => {
	const user = await findUserById(userId);
	if (!user) {
		throw new Error("User Not Found");
	}

	const bug = await findBugById(bugId);
	if (!bug) {
		throw new Error("Bug Not Found");
	}

	const project = await findProjectById(bug.projectId);
	if (!project) {
		throw new Error("Project Not Found");
	}

	if (user.projectId?.toString() !== project._id?.toString()) {
		throw new Error("You are not a part of this project");
	}

	const company = await findCompanyById(project.companyId);
	if (!company) {
		throw new Error("Company Not Found");
	}

	if (user.companyId?.toString() !== company._id?.toString()) {
		throw new Error("You are not a part of this company");
	}

	return await findCommentsByBugId(bugId);
};
