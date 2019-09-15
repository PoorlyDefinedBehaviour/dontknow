import mongoose from "../MongoDB";
const mongooseAutoPopulate = require("mongoose-autopopulate");

const ScheduleSchema = new mongoose.Schema(
  {
    issuer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      select: true,
      autopopulate: true
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      select: true,
      autopopulate: true
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
)
  .index({ date: "text", time: "text" })
  .plugin(mongooseAutoPopulate);

export interface ISchedule extends mongoose.Document {
  _id: string;
  issuer: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  date: string;
  time: string;
}

export default mongoose.model<ISchedule>("Schedule", ScheduleSchema);
