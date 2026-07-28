import project from "../models/projectModel.js"

export const createProject = async(projectData, options) => {
    return await project.create([projectData], options);
}

export const findProjectById = async(projectId) => {
    return await project.findById(projectId);
}

export const findProjectByName = async(name, companyId) => {
    return await project.findOne({name, companyId}); 
}

export const findProjectByCompanyId = async(companyId) => {
    return await project.find({companyId});
}

export const findProjectByIdAndUpdate = async(projectId, updates) => {
    return await project.findByIdAndUpdate(projectId, updates, {returnDocument: "after"});
}

export const findProjectByIdAndDelete = async(projectId) => {
    return await project.findByIdAndDelete(projectId);
}

