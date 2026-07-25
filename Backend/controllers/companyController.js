import {
	deleteCompany,
	registerCompany,
	updateCompany,
} from "../services/companyService.js";

export const create = async (req, res) => {
	try {
		const company = await registerCompany(req.body);
		res.status(201).json({
			success: true,
			message: "Company Created Successfully",
			company,
		});
	} catch (error) {
		res.status(400).json({
			success: true,
			message: error.message,
		});
	}
};

export const remove = async (req, res) => {
	try {
		const deletedCompany = await deleteCompany(req.body, req.id);
		res.status(200).json({
			success: true,
			message: "Company Deleted Succesfully",
			...deletedCompany,
		});
	} catch (error) {
		res.status(400).json({
			success: true,
			message: error.message,
		});
	}
};

export const update = async (req, res) => {
	try {
		const updatedCompany = await updateCompany(req.body, req.id);
		res.status(200).json({
			success: true,
			message: "Company Updated Succesfully",
			...updatedCompany,
		});
	} catch (error) {
		res.status(400).json({
			success: true,
			message: error.message,
		});
	}
};
