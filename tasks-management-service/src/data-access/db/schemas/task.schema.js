import mongoose from "mongoose";
const { Schema } = mongoose;

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    taskExecutionTimestamp: {
        type: Date,
        required: true,
    },
    taskReminderTimestamp: {
        type: Date,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model("task", TaskSchema);
