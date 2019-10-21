import mongoose from "../mongo";

const researchSchema = new mongoose.Schema(
  {
    authors: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      unique: false,
      select: true
    },
    title: {
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
    link: {
      type: String,
      required: false,
      unique: false,
      select: true
    }
  },
  {
    timestamps: true
  }
)

export interface IResearch extends mongoose.Document {
  authors: mongoose.Types.ObjectId[];
  title: string;
  summary: string;
  link: string;
}

export default mongoose.model<IResearch>("Research", researchSchema);
