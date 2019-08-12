import Mongoose from "../MongoDB";
import { NextFunction } from "express";

const ScheduleSchema = new Mongoose.Schema(
  {
    issuer: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      select: true
    },
    client: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      select: true
    },
    date: {
      type: String,
      required: true,
      select: true
    },
    time: {
      type: String,
      required: true,
      select: true
    }
  },
  {
    timestamps: true
  }
);

async function populate(this: any, next: NextFunction): Promise<void> {
  await this.populate("issuer");
  await this.populate("client");

  next();
}

ScheduleSchema.pre("find", populate);
ScheduleSchema.pre("findOne", populate);
ScheduleSchema.pre("findById", populate);

export interface IStore extends Mongoose.Document {
  name: string;
  phone: string;
  owner: Mongoose.Types.ObjectId;
}

export const User: Mongoose.Model<IStore> = Mongoose.model<IStore>(
  "Store",
  ScheduleSchema
);
