import mongoose from "mongoose"

const classesCancel = new mongoose.Schema({

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
    sender:{
        type:String
    },
    reciever:{
        type:String
    },
    index:{
        type:Number,default:0
    },
    origin:{
        type:String
    }
})
//how come index was working and in user schema something different had to be used.
const classesPermission = mongoose.model("ClassCancel",classesCancel);
export default classesPermission