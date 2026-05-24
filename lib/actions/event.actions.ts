"use server";

import { Event, EventDocumentShape } from '@/database/event.model';
import connectToDatabase from "../mongodb";

export type EventWithId = EventDocumentShape & { _id: string };

const toSerializableEvent = (
    event: EventDocumentShape & { _id: { toString(): string } | string },
): EventWithId => ({
    ...event,
    _id: event._id.toString(),
});

export const getAllEvents = async (): Promise<EventWithId[]> => {
    try {
        await connectToDatabase();

        const events = await Event.find().sort({ createdAt: -1 }).lean();

        return events.map((event) => toSerializableEvent(event));
    } catch (error) {
        console.error('get all events failed', error);
        return [];
    }
};

export const getEventBySlug = async (
    slug: string,
): Promise<EventWithId | null> => {
    try {
        await connectToDatabase();

        const event = await Event.findOne({ slug }).lean();

        return event ? toSerializableEvent(event) : null;
    } catch (error) {
        console.error('get event by slug failed', error);
        return null;
    }
};

export const getSimilarEventsBySlug = async (slug : string) => {
    try {
        const event = await getEventBySlug(slug);
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