import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Question from "@/models/question.model";
import Activity, { IActivity } from "@/models/activity.model";
import { redis } from "@/lib/redis";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const langMap = {
  1: "C",
  2: "C++",
  3: "Python",
  4: "Java",
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const candidateId = session?.user?.id;

    if (!candidateId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const cached = await redis.get(`question-${candidateId}`);

    if (cached) {
      const questions =
        typeof cached === "string" ? JSON.parse(cached) : cached;

      return NextResponse.json({ questions }, { status: 200 });
    }

    const activity = await Activity.findOne({ candidateId }).lean<IActivity>();
    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    const langMap = {
      1: "C",
      2: "C++",
      3: "Python",
      4: "Java",
    };

    const preferredLang = langMap[activity.preference as keyof typeof langMap];
    const subjects = ["HTML", "CSS", "SQL", "Aptitude", preferredLang];

    const questionsBySubject: Record<string, any[]> = {};

    for (const subject of subjects) {
      const questions = await Question.aggregate([
        { $match: { subject } },
        { $project: { answer: 0 } },
        { $sample: { size: 10 } },
      ]);

      questionsBySubject[subject] = questions;
    }

    await redis.set(
      `question-${candidateId}`,
      JSON.stringify(questionsBySubject),
      { ex: 60 * 120 }
    );

    return NextResponse.json(
      { questions: questionsBySubject },
      { status: 200 }
    );
  } catch (err) {
    console.error("[FETCH_QUESTIONS_ERROR]", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}