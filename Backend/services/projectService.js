import mongoose from "mongoose";
import {
	createProject as createProjectRepo, // renamed to avoid recursive call
	findProjectByCompanyId,
	findProjectById,
	findProjectByIdAndDelete,
	findProjectByIdAndUpdate,
	findProjectByName,
} from "../repositories/projectRepository.js";

import {
	findUserById,
	findUserByIdAndUpdate,
	findUsers,
	updateManyUsers,
} from "../repositories/userRepository.js";

export const createProject = async (projectData, userId) => {
	const user = await findUserById(userId);

	if (!user) {
		throw new Error("User not found");
	}

	if (!user.companyId) {
		throw new Error("User doesn't belong to a company");
	}

	if (user.role !== "Admin") {
		throw new Error("Only Admin can create Project");
	}

	const existing = await findProjectByName(projectData.name, user.companyId);

	if (existing) {
		throw new Error("Project already exists");
	}
	if (!projectData.adminId) {
		throw new Error("Please select a Project Admin");
	}

	const projectAdmin = await findUserById(projectData.adminId);

	if (!projectAdmin) {
		throw new Error("Project Admin not found");
	}

	if (projectAdmin.companyId.toString() !== user.companyId.toString()) {
		throw new Error("User does not belong to this company");
	}

	if (projectAdmin.projectId) {
		throw new Error("User already belongs to another project");
	}

	const session = await mongoose.startSession();

	let projectCreated;
	let updatedUser;

	try {
		await session.withTransaction(async () => {
			[projectCreated] = await createProjectRepo(
				{
					...projectData,
					companyId: user.companyId,
					createdBy: userId,
				},
				{ session },
			);
			console.log(projectCreated);

			updatedUser = await findUserByIdAndUpdate(
				projectData.adminId,
				{
					projectId: projectCreated._id,
					role: "ProjectAdmin",
				},
				{ session },
			);
		});
		return { projectCreated, updatedUser };
	} catch (err) {
		throw new Error(err.message, {
			cause: err,
		});
	} finally {
		session.endSession();
	}
};

export const updateProject = async (projectId, projectData, userId) => {
	const project = await findProjectById(projectId);

	if (!project) {
		throw new Error("Project not found");
	}

	const user = await findUserById(userId);

	if (!user) {
		throw new Error("User not found");
	}

	if (user.role !== "Admin") {
		throw new Error("Only Admin can update projects");
	}

	if (project.companyId.toString() !== user.companyId.toString()) {
		throw new Error("Unauthorized");
	}

	const allowedUpdates = {};

	if (projectData.name) allowedUpdates.name = projectData.name;

	if (projectData.description)
		allowedUpdates.description = projectData.description;

	const updatedProject = await findProjectByIdAndUpdate(
		projectId,
		allowedUpdates,
	);

	return updatedProject;
};

export const deleteProject = async (projectId, userId) => {
	const project = await findProjectById(projectId);

	if (!project) {
		throw new Error("Project not found");
	}

	const user = await findUserById(userId);

	if (!user) {
		throw new Error("User not found");
	}

	if (user.role !== "Admin") {
		throw new Error("Only Admin can delete projects");
	}

	if (project.companyId.toString() !== user.companyId.toString()) {
		throw new Error("Unauthorized");
	}
	await updateManyUsers({ projectId }, { projectId: null });

	await findProjectByIdAndDelete(projectId);
};

export const getProject = async (projectId, userId) => {
	const project = await findProjectById(projectId);
	if (!project) {
		throw new Error("Project Not found");
	}
	const user = await findUserById(userId);
	if (!user) {
		throw new Error("User not found");
	}
	if (!user.companyId) {
		throw new Error("User doesn't belong to a company");
	}
	if (project.companyId.toString() !== user.companyId.toString()) {
		throw new Error("Unauthorized");
	}
	return project;
};

export const getAllProjects = async (userId) => {
	const user = await findUserById(userId);

	if (!user) {
		throw new Error("User not found");
	}

	if (!user.companyId) {
		throw new Error("User doesn't belong to a company");
	}

	return await findProjectByCompanyId(user.companyId);
};

export const getAvailableProjectMembers = async(userId) => {
	const user = await findUserById(userId);
	if(!user){
		throw new Error('user not found');
	}
	if(!user.companyId){
		throw new Error('User in not in company');
	}
	if(!user.projectId){
		throw new Error('User is not in the Project');
	}
	const project = await findProjectById(user.projectId);
	if(!project){
		throw new Error("Project not found");
	}
	if(project.adminId.toString() !== userId.toString()) {
		throw new Error("Only Projecr Admi can view available members")
	}
	return await findUsers({
		projectId: user.projectId,
		role:'Unassigned'
	})
}