import { findUserById, findUserByIdAndUpdate, findUserByIdWithPassword } from "../repositories/userRepository.js"
import bcrypt from 'bcrypt'

export const getUserProfile = async(userId) => {
    const user = await findUserById(userId);
    if(!user){
        throw new Error('User not found');
    }
    return user;
}

export const updateUserProfile = async(userId, updates) => {
    const allowedUpdates = {};
    if(updates.name) allowedUpdates.name = updates.name;
    const updatedUser = await findUserByIdAndUpdate(userId, allowedUpdates);
    if(!updatedUser){
        throw new Error('user not found');
    }
    return updatedUser
}

export const changeUserPassword = async(userId, oldPassword, newPassword) => {
    const user = await findUserByIdWithPassword(userId);
    if(!user){
        throw new Error('User not found')
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch){
        throw new Error('Incorrect Old Password');
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await findUserByIdAndUpdate(userId, {password:hashPassword});
    return updatedUser;
}