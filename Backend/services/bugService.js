import {
  createBug,
  findBugById,
  findBugByIdandDelete,
  findBugByIdAndUpdate,
  findBugs,
} from "../repositories/bugRepository.js";
import { findProjectById } from "../repositories/projectRepository.js";
import { findUserById } from "../repositories/userRepository.js";

export const registerBug = async (bugData, userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  if (!user.companyId) {
    throw new Error("User doesn't belong to this company");
  }

  if (user.role !== "Tester") {
    throw new Error("Only Testers can create bugs");
  }

  const project = await findProjectById(bugData.projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.companyId.toString() !== user.companyId.toString()) {
    throw new Error("Unauthorized");
  }
  if (!user.projectId || user.projectId.toString() !== project._id.toString()) {
    throw new Error("User is not assigned to this project");
  }

  return await createBug({
    ...bugData,
    companyId: user.companyId,
    reportedBy: userId,
    assignedTo: null,
  });
};

export const getBug = async (bugId, userId) => {
  const bug = await findBugById(bugId);

  if (!bug) {
    throw new Error("Bug not found");
  }

  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (bug.companyId.toString() !== user.companyId.toString()) {
    throw new Error("Unauthorized");
  }

  if (
    !user.projectId ||
    bug.projectId.toString() !== user.projectId.toString()
  ) {
    throw new Error("Unauthorized");
  }

  return bug;
};

export const getAllBugs = async (filters, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.companyId) {
    throw new Error("User doesn't belong to a company");
  }

  if (!user.projectId) {
    throw new Error("User is not assigned to a project");
  }

  const query = {
    companyId: user.companyId,
    projectId: user.projectId,
  };

  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.assignedTo) query.assignedTo = filters.assignedTo;

  return await findBugs(query);
};

export const updateBug = async (bugId, bugData, userId) => {
  const bug = await findBugById(bugId);

  if (!bug) {
    throw new Error("Bug not found");
  }

  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (bug.companyId.toString() !== user.companyId.toString()) {
    throw new Error("Unauthorized");
  }

  if (
    !user.projectId ||
    bug.projectId.toString() !== user.projectId.toString()
  ) {
    throw new Error("Unauthorized");
  }

  const allowedUpdates = {};

  if (user.role === "Tester") {
    if (bugData.assignedTo) {
      throw new Error("Tester cannot assign bugs");
    }

    if (
      bugData.status &&
      !["Open", "Closed"].includes(bugData.status)
    ) {
      throw new Error("Tester can only set status to Open, Resolved or Closed");
    }

    if (bugData.title) allowedUpdates.title = bugData.title;
    if (bugData.description) allowedUpdates.description = bugData.description;
    if (bugData.priority) allowedUpdates.priority = bugData.priority;
    if (bugData.status) allowedUpdates.status = bugData.status;
  } else if (user.role === "Developer") {
    const keys = Object.keys(bugData);

    if (keys.length !== 1 || !bugData.status) {
      throw new Error("Developer can only update status");
    }

    if(!["InProgress", "Resolved"].includes(bugData.status)) {
      throw new Error("Developer can only set status to In Progress and Resolved");
    }

    allowedUpdates.status = bugData.status;
  } else if (user.role === "ProjectAdmin") {
    Object.assign(allowedUpdates, bugData);
  } else {
    throw new Error("Unauthorized");
  }

  return await findBugByIdAndUpdate(bugId, allowedUpdates);
};

export const deleteBug = async (bugId, userId) => {
  const bug = await findBugById(bugId);

  if (!bug) {
    throw new Error("Bug not found");
  }

  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "ProjectAdmin") {
    throw new Error("Only Project Admin can delete bugs");
  }

  if (bug.companyId.toString() !== user.companyId.toString()) {
    throw new Error("Unauthorized");
  }

  await findBugByIdandDelete(bugId);

  return {
    message: "Bug deleted successfully",
  };
};
