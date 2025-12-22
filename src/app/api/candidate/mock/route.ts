import { NextResponse } from "next/server";
import Candidate from "@/models/candidate.model";
import { connectToDB } from "@/lib/db";
import { names } from "@/constants/names";

export const runtime = "nodejs";

const branches = ["CSE", "ECE", "EEE", "ME", "CE"];
const genders = ["Male", "Female", "Other"];
const residences = ["Hostel", "Day Scholar", "Other"];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateStudentNumber(): string {
  return `23CS${Math.floor(1000 + Math.random() * 9000)}`;
}

function generatePassword(): string {
  return Math.random().toString(36).slice(-8);
}

function generatePhone(): string {
  return `9${Math.floor(100000000 + Math.random() * 900000000)}`;
}

export async function POST(request: Request) {
  console.log("🚀 /api/candidate/mock called");

  /* 🔍 ENV DEBUG — RUNS AT LAMBDA RUNTIME */
  console.log("🧪 [ENV CHECK]");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log(
    "RECAPTCHA_SECRET_KEY exists:",
    !!process.env.RECAPTCHA_SECRET_KEY
  );
  console.log(
    "RECAPTCHA_SECRET_KEY length:",
    process.env.RECAPTCHA_SECRET_KEY?.length ?? 0
  );
  console.log("DB_URI exists:", !!process.env.DB_URI);

  try {
    /* -------------------- REQUEST -------------------- */
    let body: unknown;

    try {
      body = await request.json();
      console.log(
        "📦 Request body parsed:",
        typeof body === "object" && body !== null
          ? Object.keys(body as Record<string, unknown>)
          : "Invalid body"
      );
    } catch (error) {
      console.error("❌ Failed to parse request body", error);
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (typeof body !== "object" || body === null || !("token" in body)) {
      console.warn("⚠️ Captcha token missing in request body");
      return NextResponse.json(
        { success: false, error: "Missing captcha token" },
        { status: 400 }
      );
    }

    const { token } = body as { token: string };

    /* -------------------- CAPTCHA ENV CHECK -------------------- */
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error("❌ RECAPTCHA_SECRET_KEY is undefined at runtime");
      return NextResponse.json(
        { success: false, error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    /* -------------------- CAPTCHA -------------------- */
    console.log("🧪 Verifying captcha with Google");

    const captchaRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    console.log("📡 Google captcha response status:", captchaRes.status);

    const captchaData: {
      success: boolean;
      score?: number;
      "error-codes"?: string[];
    } = await captchaRes.json();

    console.log("🤖 Captcha response:", {
      success: captchaData.success,
      score: captchaData.score,
      errors: captchaData["error-codes"],
    });

    if (!captchaData.success || (captchaData.score ?? 0) < 0.5) {
      console.warn("❌ Captcha verification failed");
      return NextResponse.json(
        {
          success: false,
          error: "Captcha verification failed",
          score: captchaData.score ?? null,
        },
        { status: 403 }
      );
    }

    /* -------------------- DB -------------------- */
    console.log("🗄️ Connecting to MongoDB...");
    await connectToDB();
    console.log("✅ MongoDB connected");

    /* -------------------- DATA -------------------- */
    const name = getRandomItem(names);
    const studentNumber = generateStudentNumber();
    const password = generatePassword();
    const email = `${studentNumber.toLowerCase()}@example.com`;
    const phone = generatePhone();

    console.log("👤 Creating candidate:", { studentNumber, email });

    /* -------------------- CREATE -------------------- */
    const candidate = await Candidate.create({
      name,
      studentNumber,
      branch: getRandomItem(branches),
      gender: getRandomItem(genders),
      email,
      residence: getRandomItem(residences),
      phone,
      password,
      isVerified: false,
    });

    console.log("✅ Candidate created:", candidate._id.toString());

    /* -------------------- RESPONSE -------------------- */
    return NextResponse.json({
      success: true,
      candidate: {
        studentNumber: candidate.studentNumber,
        password,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("🔥 [MOCK_CANDIDATE_ERROR]", {
        message: err.message,
        stack: err.stack,
      });
    } else {
      console.error("🔥 [MOCK_CANDIDATE_ERROR] Unknown error", err);
    }

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
