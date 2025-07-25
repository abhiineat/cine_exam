import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDB } from "@/lib/db";
import Activity from "@/models/activity.model";
import Candidate from "@/models/candidate.model";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { preference } = body;

    if (![1, 2, 3, 4].includes(preference)) {
      return NextResponse.json(
        { error: "Invalid preference value." },
        { status: 400 }
      );
    }

    await connectToDB();

    const candidate = await Candidate.findOne({ email: token.email });
    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found." },
        { status: 404 }
      );
    }

    const existing = await Activity.findOne({ candidateId: candidate._id });

    if (existing) {
      existing.preference = preference;
      existing.isPreferenceSet = true;
      await existing.save();
    } else {
      await Activity.create({
        candidateId: candidate._id,
        preference,
        isPreferenceSet: true,
        logInCount: 1,
        timeSpent: 0,
        adminApprovals: 0,
        isExamCompleted: false,
        lastLogin: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SET_PREFERENCE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}