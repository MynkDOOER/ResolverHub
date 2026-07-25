import { loginUser, signUpUser } from "../service/userService.js"

export const signup = async(req, res) => {
    try {
        const user = await signUpUser(req.body);
        res.status(200).json({
            success:true,
            message:'User registered successfully',
            ...user
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
export const login = async(req, res) => {
    try {
        const user = await loginUser(req.body);
        res.status(200).json({
            success:true,
            message:'User Logined successfully',
            ...user
        })
    } catch (error) {
        res.status(404).json({
            success:false,
            message:error.message
        })
    }
}