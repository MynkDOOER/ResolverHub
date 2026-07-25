import { update } from "../controllers/companyController.js";
import {
	createCompany,
	findCompanyByEmail,
	findCompanyById,
	findCompanyByIdAndDelete,
	findCompanyByIdAndUpdate,
} from "../Repositories/companyRepository.js";
import { findUserById } from "../Repositories/userRepository.js";
import crypto from "crypto";

export const registerCompany = async (companyData) => {
	const user = findUserById(companyData.id);
	if (!user) {
		throw new Error("User Not Found");
	}

	if (user.companyId) {
		throw new Error("User is already a member of a company");
	}

	const existingCompany = findCompanyByEmail(companyData.email);
	if (existingCompany) {
		throw new Error("Company Email Already In Use");
	}

	const inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();

	return await createCompany(companyData, inviteCode);
};

export const deleteCompany = async ({ companyId }, userId) => {
	const company = findCompanyById(companyId);
	if (!company) {
		throw new Error("Company Not Found");
	}

	const companyAdmin = company.adminId;
	if (userId !== companyAdmin) {
		throw new Error("User doesn't have permission to delete company");
	}

	return await findCompanyByIdAndDelete(companyId);
};

export const updateCompany = async (companyData, userId) => {
	const company = findCompanyById(companyData.id);
	if (!company) {
		throw new Error("Company Not Found");
	}

	const companyAdmin = company.adminId;
	if (userId !== companyAdmin) {
		throw new Error("User doesn't have permission to update company");
	}

	const allowedUpdates = {};
	if (companyData.name) allowedUpdates.name = companyData.name;
	if (companyData.adminId) allowedUpdates.adminId = companyData.adminId;

	return await findCompanyByIdAndUpdate(companyData.id, allowedUpdates);
};
