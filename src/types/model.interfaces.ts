import mongoose, { Schema, Document } from "mongoose";

export interface IResponse extends Document {
  quesId: Schema.Types.ObjectId;
  candidateId: Schema.Types.ObjectId;
  status: number; // enum { 0: "Not Attempted", 1: "Attempted", 2: "Marked for Review" }
  ansId?: number;
}

export interface IFeedbackQuestion extends Document {
  examId: mongoose.Schema.Types.ObjectId;
  question: string;
  type: 'text' | 'rating';
  answer: string | number; // Mixed type to allow both text and rating answers
}

export interface ISubject {
  name: string;
  optional?: boolean;
}

export interface ISubjectGroup {
  groupName?: string;
  isChoiceGroup: boolean;
  maxChoices?: number; 
  subjects: ISubject[];
}

export interface IExam extends mongoose.Document {
  title: string;
  description: string;
  duration: number;
  subjectGroups: ISubjectGroup[];
  createdBy: mongoose.Schema.Types.ObjectId;
  isActive: boolean;
  startTime?: Date;
  endTime?: Date;
}
