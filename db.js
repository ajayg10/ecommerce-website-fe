import mongoose from "mongoose";

export const connectDB = async() => {
 try {
       await mongoose.connect("mongodb+srv://Ajay10:SWC%401406@cluster0.ejviz9r.mongodb.net/<ecomm>")
       console.log("DB connected");
   } catch (error) {
        console.log("DB connection failed", error); 
   }
}