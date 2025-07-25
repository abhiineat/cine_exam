import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Candidate from "@/models/candidate.model";
import Activity from "@/models/activity.model";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;
  const isERoute = pathname.startsWith("/e");

  if (!token) {
    if (isERoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  await connectToDB();

  const candidate = await Candidate.findOne({ email: token.email });
  if (!candidate) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const activity = await Activity.findOne({ candidateId: candidate._id });
  const isPreferenceSet = activity?.preference?.length > 0;
  const isExamCompleted = !!activity?.examCompleted;

  if (!isERoute) {
    if (isExamCompleted) {
      return NextResponse.redirect(new URL("/e/feedback", req.url));
    } else if (isPreferenceSet) {
      return NextResponse.redirect(new URL("/e/exam", req.url));
    } else {
      return NextResponse.redirect(new URL("/e/instructions", req.url));
    }
  }

  if (isPreferenceSet && !isExamCompleted && pathname !== "/e/exam") {
    return NextResponse.redirect(new URL("/e/exam", req.url));
  }

  if (!isPreferenceSet && pathname !== "/e/instructions") {
    return NextResponse.redirect(new URL("/e/instructions", req.url));
  }

  if (
    isExamCompleted &&
    pathname !== "/e/feedback" &&
    pathname !== "/e/thanks"
  ) {
    return NextResponse.redirect(new URL("/e/feedback", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/e/:path*"],
};