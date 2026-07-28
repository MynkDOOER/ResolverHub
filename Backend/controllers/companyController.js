import {
	deleteCompany,
	getAvailableProjectAdmins,
	registerCompany,
	updateCompany,
} from "../services/companyService.js";

export const create = async (req, res) => {
	try {
		const data = await registerCompany(req.body, req.id);
		res.status(201).json({
			success: true,
			message: "Company Created Successfully",
			data,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const update = async (req, res) => {
	try {
		const { companyId } = req.params;
		const updatedCompany = await updateCompany(companyId, req.body, req.id);
		res.status(200).json({
			success: true,
			message: "Company Updated Succesfully",
			data: updatedCompany,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const remove = async (req, res) => {
	try {
		const { companyId } = req.params;
		const deletedCompany = await deleteCompany(companyId, req.id);
		res.status(200).json({
			success: true,
			message: "Company Deleted Succesfully",
			data: deletedCompany,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const getProjectAdmins = async(req, res) => {
	try{
		const availableUsers = await getAvailableProjectAdmins(req.id)
		res.status(200).json({
			success:true,
			data:availableUsers
		})
	} catch(error){
		res.status(400).json({
			success:false,
			message:error.message
		})
	}
}