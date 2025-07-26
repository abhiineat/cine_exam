import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface CustomToken {
  name?: string;
  email?: string;
  isPreferenceSet?: boolean;
  isExamCompleted?: boolean;
}

export async function middleware(req: NextRequest) {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as CustomToken | null;

  const { pathname } = req.nextUrl;
  const isERoute = pathname.startsWith("/e");

  const allowedPaths = [
    "/e/instructions",
    "/e/exam",
    "/e/exam/submit",
    "/e/feedback",
    "/e/thanks",
  ];

  if (!token && isERoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token) {
    const { isPreferenceSet, isExamCompleted } = token;

    if (isERoute && !allowedPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/e/exam", req.url));
    }

    if (!isERoute) {
      if (isExamCompleted) {
        return NextResponse.redirect(new URL("/e/feedback", req.url));
      } else if (isPreferenceSet) {
        return NextResponse.redirect(new URL("/e/exam", req.url));
      } else {
        return NextResponse.redirect(new URL("/e/instructions", req.url));
      }
    }

    if (!isPreferenceSet && pathname !== "/e/instructions") {
      return NextResponse.redirect(new URL("/e/instructions", req.url));
    }

    if (
      isPreferenceSet &&
      !isExamCompleted &&
      !pathname.startsWith("/e/exam")
    ) {
      return NextResponse.redirect(new URL("/e/exam", req.url));
    }

    if (
      isExamCompleted &&
      pathname !== "/e/feedback" &&
      pathname !== "/e/thanks"
    ) {
      return NextResponse.redirect(new URL("/e/feedback", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/e/:path*"],
};