import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
   {},
   {
      timestamps: true,
      strict: false,
      collection: "user",
   }
);

const User =
   models.User || mongoose.model("User", userSchema);
export default User;
