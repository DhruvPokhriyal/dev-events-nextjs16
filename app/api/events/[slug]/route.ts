import { NextRequest, NextResponse } from "next/server";
import  connectToDatabase  from "@/lib/mongodb";
import {Event} from "@/database/event.model"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        await connectToDatabase();
        const { slug } = await params;
        try {
            const event = await Event.findOne({ slug }).lean();

            if (!event) {
                return NextResponse.json({message: 'Event Not Found'}, { status: 404 });
            }

            return NextResponse.json({ event }, { status: 200 });
        } catch (error) {
            console.error("Error fetching event:", error);
            return NextResponse.json({message: 'Error Fetching Event', error: error instanceof Error ? error.message : 'Unknown error'}, { status: 500 });
        }
    } catch (error) {
        console.error("Database connection error:", error);
        return NextResponse.json({message: 'Database Connection Failed', error: error instanceof Error ? error.message : 'Unknown error'}, { status: 500 });
    }
}