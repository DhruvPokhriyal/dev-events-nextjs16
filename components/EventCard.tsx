import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Props {
    title: string;
    image: string;
}

const EventCard = ({ title, image }: Props) => {
    return (
        <Link href={`/events/${title}`} id="event-card">
            <Image
                src={image}
                alt={`${title} Image`}
                width={410}
                height={300}
                className="poster"
            />
            <p className="title">{title}</p>
        </Link>
    );
};

export default EventCard;
