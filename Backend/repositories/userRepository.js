import User from "../models/userModel.js";


export const findUserByEmail = async(email) => {
    return await User.findOne({email});
}

export const findUserById = async(id) => {
    return await User.findById(id).select('-password');
}

export const createUser = async(userData) => {
    return await User.create(userData);
}

export const findUserByIdAndUpdate = async(userId, updates) => {
    return await User.findByIdAndUpdate(userId, updates, {returnDocument:"after"}).select('-password');
}

export const findUserByIdWithPassword = async(id) => {
    return await User.findById(id);
}

export const deleteUserById = async(userId) => {
    return await User.findByIdAndDelete(userId)
}

export const findUserByRole = async(role) => {
    return await User.find({role}).select('-password')
}

// for the password change it works without findUserIdWithPassword  
