import mongoose from "../MongoDB";
const mongooseAutoPopulate = require("mongoose-autopopulate");

const ClientSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      select: true,
      autopopulate: true
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
)
  .index({ name: "text", email: "text", phone: "text" })
  .plugin(mongooseAutoPopulate);

export interface IClient extends mongoose.Document {
  _id: string;
  store: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
}

export default mongoose.model<IClient>("Client", ClientSchema);
