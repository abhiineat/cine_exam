import authOptions from "@/lib/authOptions";
import { connectToDB } from "@/lib/db";
import Feedback from "@/models/feedback.model";
import FeedbackQuestion from "@/models/feedbackQuestion.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const questions = await FeedbackQuestion.find(
      {},
      { _id: 0, question: 1, type: 1 }
    );

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error("[GET_FEEDBACK_QUESTIONS]", error);
    return NextResponse.json(
      { message: "Failed to fetch feedback questions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { answers } = await req.json();

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const feedbacks = Object.entries(answers).map(([question, answer]) => ({
      question,
      answer,
      type: typeof answer === "number" ? "rating" : "text",
    }));

    await Feedback.create({
      candidateId: session.user.id,
      feedbacks,
    });

    return NextResponse.json(
      { message: "Feedback submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST_FEEDBACK]", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
