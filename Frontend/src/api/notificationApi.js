import useAuthStore from "../stores/authStore";

const API_URL = "http://localhost:5000/api/notifications";

const getAuthHeaders = () => {
	const token = useAuthStore.getState().token;

	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
};

export const fetchCompanyRequests = async () => {
	const response = await fetch(`${API_URL}/company-requests`, {
		method: "GET",
		headers: getAuthHeaders(),
	});

	const data = await response.json();

	if (!data.success) throw new Error(data.message);

	return data.data;
};

export const acceptRequest = async (notificationId) => {
	const response = await fetch(
		`${API_URL}/${notificationId}/accept`,
		{
			method: "PATCH",
			headers: getAuthHeaders(),
		},
	);

	const data = await response.json();

	if (!data.success) throw new Error(data.message);

	return data;
};

export const denyRequest = async (notificationId) => {
	const response = await fetch(
		`${API_URL}/${notificationId}/deny`,
		{
			method: "PATCH",
			headers: getAuthHeaders(),
		},
	);

	const data = await response.json();

	if (!data.success) throw new Error(data.message);

	return data;
};