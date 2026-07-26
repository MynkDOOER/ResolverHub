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

  const projectCreated = await createProjectRepo({
    ...projectData,
    companyId: user.companyId,
    createdBy: userId,
  });

  return projectCreated;
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

  return {
    message: "Project Deleted Successfully",
  };
};

export const getProject = async(projectId, userId) => {
  const project = await findProjectById(projectId);
  if(!project){
    throw new Error("Project Not found");
  }
  const user = await findUserById(userId);
   if (!user) {
    throw new Error("User not found");
  }
  if (!user.companyId) {
    throw new Error("User doesn't belong to a company");
  }
  if(project.companyId.toString() !== user.companyId.toString()){
    throw new Error("Unauthorized");
  }
  return project;
}

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
