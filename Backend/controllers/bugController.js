import {
  deleteBug,
  getAllBugs,
  getBug,
  registerBug,
  updateBug,
} from "../services/bugService.js";

export const registerBugController = async (req, res) => {
  try {
    const bug = await registerBug(req.body, req.id);
    res.status(201).json({
      success: true,
      data: bug,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBugController = async (req, res) => {
  try {
    const updatedBug = await updateBug(req.params.id, req.body, req.id);
    res.status(200).json({
      success: true,
      data: updatedBug,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBugController = async (req, res) => {
  try {
    await deleteBug(req.params.id, req.id);
    res.status(200).json({
      success: true,
      message: "Bug Deleted",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const getBugController = async (req, res) => {
  try {
    const bug = await getBug(req.params.id, req.id);
    res.status(200).json({
      success: true,
      data: bug,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllBugController = async (req, res) => {
  try {
    const getAllBug = await getAllBugs(req.query, req.id);
    res.status(200).json({
      success: true,
      data: getAllBug,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
