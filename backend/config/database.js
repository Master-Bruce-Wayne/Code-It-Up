import mongoose from "mongoose"

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongodb connected successfully!");
    })
    .catch((err) => {
        console.log("Error connecting mongodb: ", err);
    })
};
export default connectDB;