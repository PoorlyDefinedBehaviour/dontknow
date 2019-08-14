import Mongoose from "../MongoDB";
import { NextFunction } from "express";

const ClientSchema = new Mongoose.Schema(
  {
    store: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      select: true
    },
    name: {
      type: String,
      required: true,
      unique: false,
      select: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      select: true
    },
    phone: {
      type: String,
      required: true,
      unique: false,
      select: true
    }
  },
  {
    timestamps: true
  }
).index({ name: "text", email: "text", phone: "text" });

function populate(this: any, next: NextFunction): void {
  this.populate("store");
  next();
}

ClientSchema.pre("find", populate);
ClientSchema.pre("findOne", populate);
ClientSchema.pre("findById", populate);

export interface IClient extends Mongoose.Document {
  _id: string;
  store: Mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
}

export const Client: Mongoose.Model<IClient> = Mongoose.model<IClient>(
  "Client",
  ClientSchema
);
