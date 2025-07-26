import { NextRequest, NextResponse } from "next/server";
import Activity from "@/models/activity.model";
import { connectToDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const candidateId = session?.user?.id;

    if (!candidateId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectToDB();

    const updated = await Activity.findOneAndUpdate(
      { candidateId },
      { $set: { isExamCompleted: true } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Exam marked as completed",
      activity: updated,
    });
  } catch (error) {
    console.error("Error in /api/submit:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}