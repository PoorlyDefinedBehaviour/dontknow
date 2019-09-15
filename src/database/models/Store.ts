import mongoose from "../MongoDB";
const mongooseAutoPopulate = require("mongoose-autopopulate");

const StoreSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: true,
      autopopulate: true
    },
    name: {
      type: String,
      required: true,
      unique: true,
      select: true
    },
    email: {
      type: String,
      required: false,
      unique: true,
      select: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      select: true
    }
  },
  {
    timestamps: true
  }
)
  .index({ name: "text", email: "text", phone: "text" })
  .plugin(mongooseAutoPopulate);

export interface IStore extends mongoose.Document {
  _id: string;
  owner: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
}

export default mongoose.model<IStore>("Store", StoreSchema);
