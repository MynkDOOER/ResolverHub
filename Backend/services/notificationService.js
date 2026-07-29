import mongoose from "mongoose";
import {
  createNotification,
  getUserNotifications,
  findNotificationById,
  findPendingProjectJoinRequest,
  findPendingCompanyJoinRequest,
  updateNotificationById,
  findCompanyRequestsForAdmin,
  findProjectRequestsForAdmin,
} from "../repositories/notificationRepository.js";
import { findCompanyByInviteCode } from "../repositories/companyRepository.js";
import {
  findUserById,
  findUserByIdAndUpdate,
} from "../repositories/userRepository.js";
import { findProjectById } from "../repositories/projectRepository.js";

export const requestCompanyJoin = async (inviteCode, userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User Not Found");
  }

  if (user.companyId) {
    throw new Error("You are already a member of a company");
  }

  const company = await findCompanyByInviteCode(inviteCode);
  if (!company) {
    throw new Error("Invalid invite code");
  }

  const existingRequest = await findPendingCompanyJoinRequest(
    userId,
    company._id,
  );
  if (existingRequest) {
    throw new Error("You already have a pending request for this company");
  }

  const notificationData = {
    recipientId: company.adminId,
    senderId: userId,
    type: "Company_Join_Request",
    message: `${user.name} has requested to join your workspace: ${company.name}`,
    actionStatus: "Pending",
    reference: {
      entityType: "Company",
      entityId: company._id,
    },
  };

  return await createNotification(notificationData);
};

export const requestProjectJoin = async (projectId, userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User Not Found");
  }

  if (user.projectId) {
    throw new Error("You are already a member of a company");
  }

  const project = await findProjectById(projectId);
  if (!project) {
    throw new Error("Invalid Project Id");
  }

  const existingRequest = await findPendingProjectJoinRequest(
    userId,
    projectId,
  );
  if (existingRequest) {
    throw new Error("You already have a pending request for this project");
  }

  const notificationData = {
    recipientId: project.adminId,
    senderId: userId,
    type: "Project_Join_Request",
    message: `${user.name} has requested to join your project: ${project.name}`,
    actionStatus: "Pending",
    reference: {
      entityType: "Project",
      entityId: project._id,
    },
  };

  return await createNotification(notificationData);
};

export const fetchUserNotifications = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return await getUserNotifications(userId);
};

export const markAsRead = async (notificationId, userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User Not Found");
  }

  const notification = await findNotificationById(notificationId);
  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.recipientId.toString() !== userId.toString()) {
    throw new Error("Unauthorized to modify this notification");
  }

  return await updateNotificationById(notificationId, { isRead: true });
};

// export const acceptJoinRequest = async (notificationId, userId) => {
// 	const user = await findUserById(userId);
// 	if (!user) {
// 		throw new Error("User Not Found");
// 	}

// 	const notification = await findNotificationById(notificationId);
// 	if (!notification) {
// 		throw new Error("Notification not found");
// 	}

// 	if (
// 		!["Company_Join_Request", "Project_Join_Request"].includes(
// 			notification.type,
// 		)
// 	) {
// 		throw new Error("The request is not a join request");
// 	}

// 	if (notification.actionStatus !== "Pending") {
// 		throw new Error("This request is no longer pending");
// 	}

// 	if (notification.recipientId.toString() !== userId.toString()) {
// 		throw new Error("You don't have permission to accept this request");
// 	}

// 	const session = await mongoose.startSession();
// 	let updatedNotification;
// 	let updatedUser;

// 	try {
// 		await session.withTransaction(async () => {
// 			updatedNotification = await updateNotificationById(
// 				notificationId,
// 				{ actionStatus: "Approved", isRead: true },
// 				{ session },
// 			);

// 			updatedUser = await findUserByIdAndUpdate(
// 				notification.senderId,
// 				{
// 					$set: {
// 						[notification.type === "Company_Join_Request"
// 							? "companyId"
// 							: "projectId"]: notification.reference.entityId,
// 					},
// 				},
// 				{ session },
// 			);
// 		});

// 		return { notification: updatedNotification, user: updatedUser };
// 	} catch (error) {
// 		throw new Error("Failed to process approval: " + error.message);
// 	} finally {
// 		session.endSession();
// 	}
// };

export const denyJoinRequest = async (notificationId, userId) => {
  const user = findUserById(userId);
  if (!user) {
    throw new Error("User Not Found");
  }

  const notification = await findNotificationById(notificationId);
  if (!notification) {
    throw new Error("Notification not found");
  }

  if (
    !["Company_Join_Request", "Project_Join_Request"].includes(
      notification.type,
    )
  ) {
    throw new Error("The request is not a join request");
  }

  if (notification.actionStatus !== "Pending") {
    throw new Error("This request is no longer pending");
  }

  if (notification.recipientId.toString() !== userId.toString()) {
    throw new Error("You don't have permission to deny this request");
  }

  return await updateNotificationById(notificationId, {
    actionStatus: "Declined",
    isRead: true,
  });
};

export const fetchCompanyRequests = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User Not Found");
  }

  if (user.role !== "Admin") {
    throw new Error("Only company admin can view requests");
  }

  return await findCompanyRequestsForAdmin(userId);
};

export const fetchProjectRequests = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User Not Found");
  }

  if (user.role !== "ProjectAdmin") {
    throw new Error("Only project admin can view project requests");
  }

  return await findProjectRequestsForAdmin(userId);
};

export const acceptJoinRequest = async (
  notificationId,
  userId,
  assignedRole = null,
) => {
  const user = await findUserById(userId);
  if (!user) throw new Error("User Not Found");

  const notification = await findNotificationById(notificationId);
  if (!notification) throw new Error("Notification not found");

  if (
    !["Company_Join_Request", "Project_Join_Request"].includes(
      notification.type,
    )
  ) {
    throw new Error("The request is not a join request");
  }
  if (notification.actionStatus !== "Pending") {
    throw new Error("This request is no longer pending");
  }
  if (notification.recipientId.toString() !== userId.toString()) {
    throw new Error("You don't have permission to accept this request");
  }

  const session = await mongoose.startSession();
  let updatedNotification;
  let updatedUser;

  try {
    await session.withTransaction(async () => {
      updatedNotification = await updateNotificationById(
        notificationId,
        { actionStatus: "Approved", isRead: true },
        { session },
      );

      const updateData = {
        [notification.type === "Company_Join_Request"
          ? "companyId"
          : "projectId"]: notification.reference.entityId,
      };

      // If it's a project request, enforce the role assignment
      if (notification.type === "Project_Join_Request") {
        if (!assignedRole)
          throw new Error("A role must be assigned to accept a project member");
        updateData.role = assignedRole;
      }

      updatedUser = await findUserByIdAndUpdate(
        notification.senderId,
        { $set: updateData },
        { session },
      );
    });

    return { notification: updatedNotification, user: updatedUser };
  } catch (error) {
    throw new Error("Failed to process approval: " + error.message, {
      cause: error,
    });
  } finally {
    session.endSession();
  }
};
