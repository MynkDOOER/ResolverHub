import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			default: null,
			ref: "companies",
		},
		description: {
			type: String,
			required: false,
		},
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
	},
	{ timestamps: true },
);

const project = mongoose.model("project", projectSchema);
export default project;
