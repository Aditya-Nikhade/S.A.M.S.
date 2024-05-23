import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
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
        type:String
    }
})

const calendarFormat = mongoose.model("Calendar format",calendarSchema);
export default calendarFormat;