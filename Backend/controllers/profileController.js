import { changeUserPassword, getUserProfile, updateUserProfile } from "../services/profileService.js"


export const getMe = async(req, res) => {
    try {
        const user = await getUserProfile(req.id);
        res.status(200).json({
            success:true,
            message:'profile fetched Successfully',
            name: user.name, email: user.email, role: user.role
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message: error.message
        })
    }
}

export const updateProfile = async(req, res) => {
    try {
        const updatedUser = await updateUserProfile(req.id, req.body)
        res.status(200).json({
            success:true,
            message:'profile updated Successfully',
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message: error.message
        })
    }
}

export const changePassword = async(req, res) => {
    try {
        const {oldPassword, newPassword} = req.body;
        const updatedUser = await changeUserPassword(req.id, oldPassword, newPassword)
        res.status(200).json({
            success:true,
            message:'password changed Successfully'
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message: error.message
        })
    }
}