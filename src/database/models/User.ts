import Mongoose from "../MongoDB";

import { hash } from "bcryptjs";

import { NextFunction } from "express";

const UserSchema = new Mongoose.Schema(
  {
    accountLocked: {
      type: Boolean,
      select: true,
      default: false
    },
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
).index({ email: "text" });

UserSchema.pre("save", async function(
  this: any,
  next: NextFunction
): Promise<void> {
  const password: string = this.get("password");

  if (password && this.isModified("password")) {
    this.set("password", await hash(password, 10));
  }

  next();
});

export interface IUser extends Mongoose.Document {
  accountLocked: boolean;
  username: string;
  email: string;
  password: string;
}

export const User: Mongoose.Model<IUser> = Mongoose.model<IUser>(
  "User",
  UserSchema
);
