"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";

interface Props {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

const EventCard = ({ title, image, slug, location, date, time }: Props) => {
    return (
        <Link
            href={`/events/${slug}`}
            id="event-card"
            onClick={() =>
                posthog.capture("event_card_clicked", {
                    event_title: title,
                    event_slug: slug,
                    event_location: location,
                    event_date: date,
                })
            }
        >
            <Image
                src={image}
                alt={`${title} Image`}
                width={410}
                height={300}
                className="poster"
            />
            <div className="flex flex-row gap-2">
                <Image
                    src="/icons/pin.svg"
                    alt="Location"
                    width={14}
                    height={14}
                />
                <p className="location">{location}</p>
            </div>
            <p className="title">{title}</p>
            <div className="datetime">
                <div>
                    <Image
                        src="/icons/calendar.svg"
                        alt="Date"
                        width={14}
                        height={14}
                    />
                    <p className="date">{date}</p>
                </div>
                <div>
                    <Image
                        src="/icons/clock.svg"
                        alt="Time"
                        width={14}
                        height={14}
                    />
                    <p className="time">{time}</p>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
