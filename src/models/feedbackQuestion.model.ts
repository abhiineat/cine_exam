import mongoose from 'mongoose';
import { IFeedbackQuestion } from '@/types/model.interfaces';

const feedbackQuestionSchema = new mongoose.Schema<IFeedbackQuestion>({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  question: { type: String, required: true },
  type: { type: String, enum: ['text', 'rating'], required: true },
  answer: { type: mongoose.Schema.Types.Mixed, required: true },
}, { versionKey: false, timestamps: false });

export default mongoose.models.FeedbackQuestion || mongoose.model<IFeedbackQuestion>('FeedbackQuestion', feedbackQuestionSchema);