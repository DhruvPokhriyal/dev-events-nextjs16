import {v2 as cloudinary} from "cloudinary";

import { NextRequest, NextResponse } from "next/server";
import  connectToDatabase  from "@/lib/mongodb";
import {Event} from "@/database/event.model"


export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const formData = await request.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch(error) {
            console.error("Error parsing form data:", error);
            return NextResponse.json({message: 'Invalid JSON data format', error: error instanceof Error ? error.message : 'Unknown error'}, { status: 400 });
        }
        const file = formData.get('image') as File | null;

        if (!file){
            return NextResponse.json({message: 'Image file is required'}, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'dev-event'}, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }).end(buffer);
        })

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create(event);

        return NextResponse.json( {message: 'Event Created Successfully', event: createdEvent}, { status: 201 });
    } catch (error) {
        console.error("Error handling POST request:", error);
        return NextResponse.json({message: 'Event Creation Failed', error: error instanceof Error ? error.message : 'Unknown error'}, { status: 500 });
    }
}

export async function GET() {
    try {

        await connectToDatabase();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json( {message: 'Events fetched successfully', events}, { status: 200 });

    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({message: 'Failed to fetch events', error: error instanceof Error ? error.message : 'Unknown error'}, { status: 500 });
    }
}



