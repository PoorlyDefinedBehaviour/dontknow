import mongoose from "../MongoDB";
import { hash } from "bcryptjs";
import { NextFunction } from "express";
const mongooseAutoPopulate = require("mongoose-autopopulate");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      select: true
    },
    password: {
      type: String,
      required: true,
      unique: false,
      select: false
    }
  },
  {
    timestamps: true
  }
)
  .index({ email: "text" })
  .plugin(mongooseAutoPopulate);

UserSchema.pre("save", async function(
  this: any,
  next: NextFunction
): Promise<void> {
  const password: string = this.get("password");

  // move this to model
  if (password && this.isModified("password")) {
    this.set("password", await hash(password, 10));
  }
  next();
});

export interface IUser extends mongoose.Document {
  _id: string;
  accountLocked: boolean;
  email: string;
  password: string;
}

export default mongoose.model<IUser>("User", UserSchema);
