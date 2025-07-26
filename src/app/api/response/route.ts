import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Response from "@/models/response.model";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const candidateId = session?.user?.id;

    if (!candidateId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { quesId, status, ansId } = body;

    if (!quesId) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const response = await Response.findOneAndUpdate(
      { candidateId, quesId },
      {
        $set: {
          status: status ?? 1,
          ansId: ansId ?? null,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({ success: true, response }, { status: 200 });
  } catch (err) {
    console.error("[REGISTER_RESPONSE_ERROR]", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const candidateId = session?.user?.id;

    if (!candidateId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const responses = await Response.find({ candidateId }).lean();

    return NextResponse.json({ responses }, { status: 200 });
  } catch (err) {
    console.error("[FETCH_RESPONSES_ERROR]", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}