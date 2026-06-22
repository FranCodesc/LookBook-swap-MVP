import mongoose from "mongoose";

export async function connectDB() {
    mongoose.set("sanitizeFilter", true)
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connection successful")
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
    
}