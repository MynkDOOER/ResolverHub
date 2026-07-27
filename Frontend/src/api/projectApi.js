import useAuthStore from "../stores/authStore";
const API_URL = "http://localhost:5000/api/projects";

const getAuthHeaders = () => {
    const token = useAuthStore.getState().token;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const fetchAllProjects = async () => {
  const response = await fetch(`${API_URL}/all`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const createNewProject = async (projectData) => {
  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

export const deleteProjectById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
};
