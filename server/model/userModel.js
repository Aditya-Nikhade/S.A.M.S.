import mongoose from "mongoose";

const userNew = new mongoose.Schema({
    username: {
        type: String,required:true
    },
    userID:{
        type:String,required:true
    },
    password:{
        type:String,required:true,unique:true
    },
    progress: {
        type: [{
            money: { type: Boolean, default: false },
            classes: { type: Boolean, default: false },
            location: { type: Boolean, default: false }
        }],
        default: function () {
            return [{
                money: false,
                classes: false,
                location: false
            }];
        }
    },
    origin:{
        type:String
    }

},{timestamps:true})

const User = mongoose.model("newUser",userNew);
export default User