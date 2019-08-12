import Mongoose from "../MongoDB";
import { NextFunction } from "connect";

const StoreSchema = new Mongoose.Schema(
  {
    owner: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: true
    },
    owner_name: {
      type: String,
      required: true,
      unique: false,
      select: true
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
).index({ name: "text" });

async function populate(this: any, next: NextFunction): Promise<void> {
  await this.populate("owner");
  next();
}

StoreSchema.pre("find", populate);
StoreSchema.pre("findOne", populate);
StoreSchema.pre("findById", populate);

export interface IStore extends Mongoose.Document {
  owner: Mongoose.Types.ObjectId;
  owner_name: string;
  name: string;
  email: string;
  phone: string;
}

export const Store: Mongoose.Model<IStore> = Mongoose.model<IStore>(
  "Store",
  StoreSchema
);
