import mongoose from "mongoose";

const moneySchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    money:{
        type:Number,
        required:true
    },
    sender:{
        type:String,
    },
    reciever:{
        type:String,
    },
    index:{
        type:Number,default:0
    },
    origin:{
        type:String
    }
})

const moneyForm = mongoose.model("MoneyForm",moneySchema);
export default moneyForm;