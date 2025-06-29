import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";


const userSchema = new mongoose.Schema({
    id:{type: String, required: true},
    username:{type: String, required: true,unique:true},
    name:{type: String, required: true},
    bio:String,
    image:String,
    threads:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Thread"
        }
    ],
    onboarded:[
        {
            type:Boolean,
            default: false
        }
    ],
    communities:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Community"
        }
    ]
})

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;