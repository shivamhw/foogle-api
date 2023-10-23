import mongoose from "mongoose";


const mongoURI = process.env.DATABASE_URI!
mongoose.connect(mongoURI)


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    email: String
  });



export const userModel = mongoose.model('users', userSchema);

