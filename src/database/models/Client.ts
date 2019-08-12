import Mongoose from "../MongoDB";

const ClientSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      select: true
    },
    email: {
      type: String,
      required: true,
      unique: false,
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

export interface IClient extends Mongoose.Document {
  name: string;
  email: string;
  phone: string;
}

export const Client: Mongoose.Model<IClient> = Mongoose.model<IClient>(
  "Client",
  ClientSchema
);
