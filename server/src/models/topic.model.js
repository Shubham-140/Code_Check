import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
    topicName: {
        type: String,
        required: true,
        unique: true
    },
    topicCode: {
        type: String,
        minlength: 1,
        maxlength: 2,
        required: true,
        unique:true,
        uppercase:true
    },
    description:{
        required:true,
        maxlength:500,
        type:String
    }
})

export const Topic = mongoose.model("Topic", topicSchema);