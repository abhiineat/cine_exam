import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { token } = await request.json();

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const res = await fetch(verifyURL, { method: "POST" });
    const data = await res.json();
    console.log(data.score);
    if (!data.success || data.score < 0.5) {
        return NextResponse.json(
            { success: false, score: data.score },
            { status: 403 }
        );
    }

    return NextResponse.json({ success: true, score: data.score });
}