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

export async function POST() {
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

  try {
    const candidate = await Candidate.create(newCandidate);
    return NextResponse.json({
      success: true,
      candidate: {
        studentNumber: candidate.studentNumber,
        password: password,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create candidate",
      },
      { status: 500 }
    );
  }
}
