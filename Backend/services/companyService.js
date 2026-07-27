import mongoose from "mongoose";

import {
  createCompany,
  findCompanyByEmail,
  findCompanyById,
  findCompanyByIdAndDelete,
  findCompanyByIdAndUpdate,
} from "../repositories/companyRepository.js";
import {
  findUserById,
  findUserByIdAndUpdate,
  updateManyUsers,
} from "../repositories/userRepository.js";
import crypto from "crypto";

export const registerCompany = async (companyData, userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User Not Found");
  }

  if (user.companyId) {
    throw new Error("User is already a member of a company");
  }

  const existingCompany = await findCompanyByEmail(companyData.email);
  if (existingCompany) {
    throw new Error("Company Email Already In Use");
  }

  const inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();

  const session = await mongoose.startSession();

  let company;
  let updatedUser;

  try {
    await session.withTransaction(async () => {
      company = await createCompany(companyData, inviteCode, userId, {
        session,
      });
      updatedUser = await findUserByIdAndUpdate(
        userId,
        {
          companyId: company._id,
          role: "Admin",
        },
        { session },
      );
    });

    return { company, updatedUser };
  } catch (err) {
    throw new Error(err.message, {
      cause: err,
    });
  } finally {
    session.endSession();
  }
};

export const updateCompany = async (companyId, companyData, userId) => {
  const company = await findCompanyById(companyId);
  if (!company) {
    throw new Error("Company Not Found");
  }

  const companyAdminId = company.adminId.toString();
  if (userId !== companyAdminId) {
    throw new Error("User doesn't have permission to update company");
  }

  const allowedUpdates = {};
  if (companyData.name) allowedUpdates.name = companyData.name;

  const isTransferringAdmin =
    companyData.adminId && companyData.adminId !== companyAdminId;
  if (isTransferringAdmin) {
    const targetUser = await findUserById(companyData.adminId);
    if (!targetUser) {
      throw new Error("Target User Not Found");
    }

    if (targetUser.companyId.toString() !== company._id.toString()) {
      throw new Error("Target User is not in the company");
    }
    allowedUpdates.adminId = companyData.adminId;
  }
  if (isTransferringAdmin) {
    const session = await mongoose.startSession();
    let updatedCompany;

    try {
      await session.withTransaction(async () => {
        updatedCompany = await findCompanyByIdAndUpdate(
          companyId,
          allowedUpdates,
          { session },
        );

        await findUserByIdAndUpdate(
          companyAdminId,
          { role: "Unassigned" },
          { session },
        );

        // 3. Promote the new admin
        await findUserByIdAndUpdate(
          companyData.adminId,
          { role: "Admin" },
          { session },
        );
      });

      return {
        name: updatedCompany.name,
        email: updatedCompany.email,
        inviteCode: updatedCompany.inviteCode,
        adminId: updatedCompany.adminId,
      };
    } catch (err) {
      throw new Error(err.message);
    } finally {
      session.endSession();
    }
  } else {
    const updatedCompany = await findCompanyByIdAndUpdate(
      companyId,
      allowedUpdates,
    );

    return {
      name: updatedCompany.name,
      email: updatedCompany.email,
      inviteCode: updatedCompany.inviteCode,
      adminId: updatedCompany.adminId,
    };
  }
};

export const deleteCompany = async (companyId, userId) => {
  const company = await findCompanyById(companyId);
  if (!company) {
    throw new Error("Company Not Found");
  }

  const companyAdmin = company.adminId.toString();
  if (userId !== companyAdmin) {
    throw new Error("User doesn't have permission to delete company");
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await updateManyUsers(
        { companyId: companyId },
        {
          companyId: null,
          projectId: null,
          role: "Unassigned",
        },
        { session },
      );

      await findCompanyByIdAndDelete(companyId, { session });
    });

    return {
      message: "Company and related user references deleted successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  } finally {
    session.endSession();
  }
};
