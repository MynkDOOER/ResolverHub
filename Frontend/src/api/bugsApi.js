import useAuthStore from "../stores/authStore";
const API_URL = "http://localhost:5000/api/bugs";

const getAuthHeaders = () => {
    const token = useAuthStore.getState().token;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const fetchAllBugs = async () => {
  const response = await fetch(`${API_URL}/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};


export const fetchBug = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const createNewBug = async (BugData) => {
  const response = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(BugData),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

export const deleteBugById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

export const updateBugById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

