import User from "../models/userModel.js";

export const findUserByEmail = async (email) => {
	return await User.findOne({ email });
};

export const findUserById = async (id) => {
	return await User.findById(id).select("-password");
};

export const createUser = async (userData) => {
	return await User.create(userData);
};

export const findUserByIdAndUpdate = async (userId, updates, options = {}) => {
	return await User.findByIdAndUpdate(userId, updates, {
		returnDocument: "after",
		...options,
	}).select("-password");
};

export const findUserByIdWithPassword = async (id) => {
	return await User.findById(id);
};

export const deleteUserById = async (userId) => {
	return await User.findByIdAndDelete(userId);
};

export const findUserByRole = async (role) => {
	return await User.find({ role }).select("-password");
};

export const updateManyUsers = async (filter, updates, options = {}) => {
	return await User.updateMany(filter, updates, options);
};

// for the password change it works without findUserIdWithPassword
