import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Question from "@/models/question.model";
import Activity from "@/models/activity.model";
import { redis } from "@/lib/redis";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const langMap = {
  1: "C",
  2: "C++",
  3: "Python",
  4: "Java",
};

export interface IActivity {
  candidateId: string;
  preference: 1 | 2 | 3 | 4;
  isPreferenceSet?: boolean;
  isExamCompleted?: boolean;
}

const shuffle = <T>(array: T[]): T[] => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const candidateId = session?.user?.id;

    if (!candidateId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const activity = await Activity.findOne({ candidateId }).lean<IActivity>();
    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    const preferredLang = langMap[activity.preference as keyof typeof langMap];
    const subjects = ["HTML", "CSS", "SQL", "Aptitude", preferredLang];

    const allQuestions = await Question.find({
      subject: { $in: subjects },
    }).lean();

    const shuffledQuestionsBySubject: Record<
      string,
      Omit<(typeof allQuestions)[0], "answer">[]
    > = {};

    for (const subject of subjects) {
      const questionsForSubject = allQuestions
        .filter((q) => q.subject === subject)
        .map(({ answer, ...rest }) => rest);

      shuffledQuestionsBySubject[subject] = shuffle(questionsForSubject);
    }

    await redis.set(
      `questions:${candidateId}`,
      JSON.stringify(shuffledQuestionsBySubject),
      { ex: 60 * 30 }
    );

    return NextResponse.json(
      { questions: shuffledQuestionsBySubject },
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
