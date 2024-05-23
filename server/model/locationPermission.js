import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    reason:{
        type:String,
        required:true
    },
    day:{
        type:Date,
        required:true
    },
    fromTime:{
        type:String,
        required:true
    },
    toTime:{
        type:String,
        required:true
    },
    origin:{
        type:String
    },
    location:{
        type:String,
        required:true
    },
    sender:{
        type:String,required:true
    },
    recipient:{
        type:String,required:true
    },
    index:{
        type:Number,default:0
    }
})

const locationPermission = mongoose.model("Location Permission",locationSchema);
export default locationPermission;