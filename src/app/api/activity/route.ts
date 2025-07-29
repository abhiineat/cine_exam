import { NextResponse } from "next/server";
import Activity from "@/models/activity.model";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const candidateId = session?.user?.id;
    try {
        const data = await Activity.find({ candidateId });
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}