import mongoose from 'mongoose'

const AlumniActSchema = new mongoose.Schema(
    {
        _id: {type: Number, required: true},
        title:{type: String, required: true},
        content: {type: String, required: true},
        img_url:{type: String}
    }, 
    {
        timestamps: true,
    }
);

const AlumniActivities = mongoose.model("AlumniActivities", AlumniActSchema);
export default AlumniActivities;