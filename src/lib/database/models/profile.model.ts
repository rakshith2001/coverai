import { Document, Schema, model, models } from "mongoose";

const profileSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    workExperience:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

const Profile = models?.Profile || model("Profile", profileSchema);

export default Profile;