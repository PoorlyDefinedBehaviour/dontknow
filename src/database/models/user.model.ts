import mongoose from "../mongo";
import { hash } from "bcryptjs";
import { NextFunction } from "express";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: false,
      unique: false,
      select: true
    },
    last_name: {
      type: String,
      required: false,
      unique: false,
      select: true
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
    },
    token: {
      type: String,
      required: false,
      unique: false,
      select: false
    },
    summary: {
      type: String,
      required: false,
      unique: false,
      select: true
    },
    social_network_links: {
      type: [String],
      required: false,
      unique: false,
      select: true
    },
    researches: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Research",
      required: false,
      unique: false,
      select: true
    }
  },
  {
    timestamps: true
  }
).pre("save", async function(this: any, next: NextFunction): Promise<void> {
  const password: string = this.get("password");

  if (password && this.isModified("password")) {
    this.set("password", await hash(password, 10));
  }

  next();
});

export interface IUser extends mongoose.Document {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  token: string;
  summary: string;
  social_network_links: string[];
  researches: mongoose.Types.ObjectId[];
}

export default mongoose.model<IUser>("User", userSchema);
