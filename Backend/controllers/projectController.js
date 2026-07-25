import {
    createProject,
    updateProject,
    deleteProject,
    getAllProjects,
} from "../services/projectService.js";

export const createProjectController = async (req, res) => {
    try {
        const project = await createProject(req.body, req.id);

        res.status(201).json({
            success: true,
            message: "Project Created Successfully",
            data: project,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

export const updateProjectController = async (req, res) => {
    try {
        const updatedProject = await updateProject(
            req.params.id,
            req.body,
            req.id
        );

        res.status(200).json({
            success: true,
            message: "Project Updated Successfully",
            data: updatedProject,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

export const deleteProjectController = async (req, res) => {
    try {
        const result = await deleteProject(
            req.params.id,
            req.id 
        );

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

export const getAllProjectsController = async (req, res) => {
    try {
        const projects = await getAllProjects(req.id); 

        res.status(200).json({
            success: true,
            data: projects,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};