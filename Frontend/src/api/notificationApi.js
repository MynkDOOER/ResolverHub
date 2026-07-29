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

export const acceptRequest = async (notificationId, role = null) => {
  // If a role is provided, send it. If not, send an empty JSON object.
  const bodyPayload = role ? { role } : {};

  const response = await fetch(`${API_URL}/${notificationId}/accept`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(bodyPayload),
  });

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

export const requestToJoinProject = async (projectId) => {
  const response = await fetch(`${API_URL}/project/join`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ projectId }),
  });

  const data = await response.json();

  if (!data.success) throw new Error(data.message);

  return data;
};

export const fetchProjectRequests = async () => {
	const response = await fetch(`${API_URL}/project-requests`, {
		method: "GET",
		headers: getAuthHeaders(),
	});
	const data = await response.json();
	if (!data.success) throw new Error(data.message);
	return data.data;
};