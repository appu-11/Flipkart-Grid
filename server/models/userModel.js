import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    seller: {
      type: Boolean,
      required: true,
    },
    claimed:{
      type: Boolean,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
