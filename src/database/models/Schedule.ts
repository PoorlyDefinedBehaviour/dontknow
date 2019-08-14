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
).index({ date: "text", time: "text" });

function populate(this: any, next: NextFunction): void {
  this.populate("issuer");
  this.populate("client");

  next();
}

ScheduleSchema.pre("find", populate);
ScheduleSchema.pre("findOne", populate);
ScheduleSchema.pre("findById", populate);

export interface ISchedule extends Mongoose.Document {
  _id: string;
  issuer: Mongoose.Types.ObjectId;
  client: Mongoose.Types.ObjectId;
  date: string;
  time: string;
}

export const Schedule: Mongoose.Model<ISchedule> = Mongoose.model<ISchedule>(
  "Schedule",
  ScheduleSchema
);
