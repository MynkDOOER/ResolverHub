import {
	acceptJoinRequest,
	denyJoinRequest,
	fetchCompanyRequests,
	fetchProjectRequests,
	fetchUserNotifications,
	markAsRead,
	requestCompanyJoin,
	requestProjectJoin,
} from "../services/notificationService.js";

export const joinCompany = async (req, res) => {
	try {
		const notification = await requestCompanyJoin(
			req.body.inviteCode,
			req.id,
		);
		res.status(201).json({
			success: true,
			message: "Company Join Request Successfully Sent",
			notification,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const joinProject = async (req, res) => {
	try {
		const notification = await requestProjectJoin(
			req.body.projectId,
			req.id,
		);
		res.status(201).json({
			success: true,
			message: "Project Join Request Successfully Sent",
			notification,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const getNotifications = async (req, res) => {
	try {
		const notifications = await fetchUserNotifications(req.id);
		res.status(200).json({
			success: true,
			message: "Notifications Fetched Successfully",
			notifications,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const markNotificationAsRead = async (req, res) => {
	try {
		const notification = await markAsRead(req.params.id, req.id);
		res.status(200).json({
			success: true,
			message: "Notification Successfully Marked As Read",
			notification,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const acceptRequest = async (req, res) => {
	try {
		const role = req.body?.role;
		const data = await acceptJoinRequest(req.params.id, req.id, role);
		res.status(200).json({
			success: true,
			message: "Request Accepted Successfully",
			...data,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const denyRequest = async (req, res) => {
	try {
		const data = await denyJoinRequest(req.params.id, req.id);
		res.status(200).json({
			success: true,
			message: "Request Declined Successfully",
			...data,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const getCompanyRequests = async (req, res) => {
    try {
        const requests = await fetchCompanyRequests(req.id);

        res.status(200).json({
            success: true,
            data: requests,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getProjectRequests = async (req, res) => {
    try {
        // Call the service we just created
        const requests = await fetchProjectRequests(req.id);
        res.status(200).json({
            success: true,
            data: requests,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};