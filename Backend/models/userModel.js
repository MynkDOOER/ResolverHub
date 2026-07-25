import mongoose from "mongoose";
const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },

    email:{
        type:String,
        required: true
    },

    password:{
        type:String,
        required:true
    },
    
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null
    },
    projectId: {
        type:mongoose.Schema.Types.ObjectId,
        default:null
    },
    role:{
        type:String,
        enum:['Admin', 'ProjectAdmin', 'Developer', 'Tester', 'Unassigned'],
        default:'Unassigned'
    }

},{timestamps:true})

const User = mongoose.model('User', userSchema)

export default User;