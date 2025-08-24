import { NextResponse } from "next/server";
import Candidate from "@/models/candidate.model";
import { connectToDB } from "@/lib/db";
import { names } from "@/constants/names";

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
    try {
        const { token } = await request.json();
        if (!token) {
            return NextResponse.json(
                { success: false, error: "Missing captcha token" },
                { status: 400 }
            );
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

        const captchaRes = await fetch(verifyURL, { method: "POST" });
        const data = await captchaRes.json();

        if (!data.success || data.score < 0.5) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Captcha verification failed",
                    score: data.score,
                },
                { status: 403 }
            );
        }

        await connectToDB();

        const name = getRandomItem(names);
        const studentNumber = generateStudentNumber();
        const password = generatePassword();
        const email = `${studentNumber.toLowerCase()}@example.com`;
        const phone = generatePhone();

        const newCandidate = {
            name,
            studentNumber,
            branch: getRandomItem(branches),
            gender: getRandomItem(genders),
            email,
            residence: getRandomItem(residences),
            phone,
            password,
            isVerified: false,
        };

        const candidate = await Candidate.create(newCandidate);

        return NextResponse.json({
            success: true,
            candidate: {
                studentNumber: candidate.studentNumber,
                password: password,
            },
        });
    } catch (err) {
        console.error("[MOCK_CANDIDATE_ERROR]", err);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}