import Bugs from "../models/bugModel.js"

export const createBug = async(bugData) => {
    return await Bugs.create(bugData)
}

export const findBugById = async(bugId) => {
    return await Bugs.findById(bugId)
}

export const findBugByIdAndUpdate = async(bugId, updates) => {
    return await Bugs.findByIdAndUpdate(bugId, updates, {
        returnDocument:'after',
        runValidators:true,
    });
};

export const findBugByIdandDelete = async(bugId) => {
    return await Bugs.findByIdAndDelete(bugId);
}

export const findBugs = async(filters) => {
    return await Bugs.find(filters)
    .populate('reportedBy', 'name email')
    .populate('assignedTo', 'name email')
    .populate('projectId', 'name');
}