"use server";

import { Event, EventDocumentShape } from '@/database/event.model';
import connectToDatabase from "../mongodb";

export const getSimilarEventsBySlug = async (slug : string) => {
    try {
        await connectToDatabase();
        const event = await Event.findOne({slug});
        if (!event) throw new Error("Event not found");

        // 1. THIS IS THE MISSING PIECE: Fetch the events from the database first
        const similarEvents = await Event.find({ 
            _id: {$ne: event._id }, 
            tags: {$in: event.tags}
        }).lean();
 
        // 2. Now that similarEvents exists, you can safely map over it
        return similarEvents.map((evt: EventDocumentShape & { _id : any}) => ({
            ...evt,
            _id: evt._id.toString(), // Convert ObjectId class to plain string
            
            // Note: If fields like 'organizer' or 'venue' are ALSO ObjectIds, 
            // you must stringify them here too, e.g.:
            // organizer: evt.organizer?.toString(),
        })) as unknown as EventDocumentShape[];

    } catch {
        return [];
    }
}