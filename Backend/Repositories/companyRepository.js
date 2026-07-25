import Company from "../models/companyModel.js";

export const createCompany = async (companyData, inviteCode) => {
	return await Company.create({
		name: companyData.name,
		email: companyData.email,
		inviteCode,
		adminId: companyData.id,
	});
};

export const findCompanyByEmail = async (email) => {
	return await Company.findOne({ email });
};

export const findCompanyById = async (companyId) => {
	return await Company.findById(companyId);
};

export const findCompanyByInviteCode = async (inviteCode) => {
	return await Company.findOne({ inviteCode: inviteCode });
};

export const findCompanyByIdAndUpdate = async (companyId, updates) => {
	return await Company.findByIdAndUpdate(companyId, updates, { new: true });
};

export const findCompanyByIdAndDelete = async (companyId) => {
	return await Company.findByIdAndDelete(companyId);
};
