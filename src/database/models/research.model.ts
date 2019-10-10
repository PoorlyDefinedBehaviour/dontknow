import mongoose from "../mongo";

const researchSchema = new mongoose.Schema(
  {
    authors: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      unique: false,
      select: true
    },
    topic: {
      type: String,
      required: true,
      unique: false,
      select: true
    },
    summary: {
      type: String,
      required: true,
      unique: false,
      select: true
    },
    links: {
      type: [String],
      required: false,
      unique: false,
      select: true
    }
  },
  {
    timestamps: true
  }
).plugin(require("mongoose-autopopulate"));

export interface IResearch extends mongoose.Document {
  authors: mongoose.Types.ObjectId[];
  topic: string;
  summary: string;
  link: string;
}

export default mongoose.model<IResearch>("Research", researchSchema);
