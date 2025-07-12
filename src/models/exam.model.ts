import mongoose from "mongoose";
import { IExam } from "@/types/model.interfaces";

const examSchema = new mongoose.Schema<IExam>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    startTime: { type: Date },
    endTime: { type: Date },

    subjectGroups: [
      {
        groupName: { type: String }, 
        isChoiceGroup: { type: Boolean, default: false }, 
        maxChoices: { type: Number, default: 1 }, 
        subjects: [
          {
            name: { type: String, required: true },
            optional: { type: Boolean, default: false }, 
          },
        ],
      },
    ],
  },
  { versionKey: false, timestamps: true }
);  

export default mongoose.models.Exam || mongoose.model<IExam>('Exam', examSchema);