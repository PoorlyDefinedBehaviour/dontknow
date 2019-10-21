import mongoose from "../mongo";
import { hash } from "bcryptjs";
import { NextFunction } from "express";

const userSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: false,
      unique: false,
      select: false
    },
    avatar: {
      type: String,
      required: false,
      unique: false,
      select: true,
      default: "default-profile-picture.png"
    },
    firstName: {
      type: String,
      required: false,
      unique: false,
      select: true
    },
    lastName: {
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
    experiences: [
      {
        id: {
          type: String,
          required: true,
          unique: true,
          select: true
        },
        title: {
          type: String,
          required: true,
          unique: false,
          select: true
        },
        from: {
          type: Date,
          required: true,
          unique: false,
          select: true
        },
        to: {
          type: Date,
          required: false,
          unique: false,
          select: true
        }
      }
    ],
    researches: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Research",
      required: false,
      unique: false,
      select: true,
      autopopulate: true
    }
  },
  {
    timestamps: true
  }
).plugin(require("mongoose-autopopulate"));

userSchema.pre("save", async function(
  this: any,
  next: NextFunction
): Promise<void> {
  const password: string = this.get("password");

  if (password && this.isModified("password")) {
    this.set("password", await hash(password, 10));
  }

  next();
});

export interface IExperience {
  id?: string;
  title: string;
  from: Date;
  to?: Date;
}

export interface IUser extends mongoose.Document {
  _id: string;
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  token: string;
  summary: string;
  social_network_links: string[];
  researches: mongoose.Types.ObjectId[];
  experiences: IExperience[];
}

export default mongoose.model<IUser>("User", userSchema);
