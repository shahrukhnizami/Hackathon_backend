import mongoose from 'mongoose'



const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://nizamishahrukh12:pakistan123@project-01.9vzed.mongodb.net/Landlord");
        console.log("MongoDB connected successfully.");
        return "mongoDB connect"
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB
