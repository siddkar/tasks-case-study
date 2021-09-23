import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
    clientId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    scopes: {
        type: [String],
    },
    sessionTokenList: {
        type: [String],
    },
    createdTimestamp: {
        type: Date,
        default: new Date().toISOString(),
    },
});

export default mongoose.model("userpool", UserSchema);
