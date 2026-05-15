import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import React from "react";

const events = [
    {
        image: "/images/event1.png",
        title: "Hackathon 2024",
        slug: "hackathon-2024",
        location: "San Francisco, CA",
        date: "2024-09-15",
        time: "10:00 AM - 6:00 PM",
    },
    {
        image: "/images/event2.png",
        title: "Tech Meetup NYC",
        slug: "tech-meetup-nyc",
        location: "New York, NY",
        date: "2024-10-20",
        time: "6:00 PM - 10:00 PM",
    },
    {
        image: "/images/event3.png",
        title: "Developer Conference 2024",
        slug: "developer-conference-2024",
        location: "Austin, TX",
        date: "2024-11-10",
        time: "9:00 AM - 5:00 PM",
    },
    {
        image: "/images/event4.png",
        title: "AI & ML Summit",
        slug: "ai-ml-summit",
        location: "Seattle, WA",
        date: "2024-12-05",
        time: "8:00 AM - 4:00 PM",
    },
    {
        image: "/images/event5.png",
        title: "Open Source Festival",
        slug: "open-source-festival",
        location: "Boston, MA",
        date: "2025-01-15",
        time: "11:00 AM - 7:00 PM",
    },
];

const Page = () => {
    return (
        <section>
            <h1 className="text-center">
                The Hub for Every Dev <br></br> Event You Can't Miss
            </h1>
            <p className="text-center mt-5">
                Hackathons, Meetups and Conferences, All in One Place
            </p>
            <ExploreBtn></ExploreBtn>
            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>

                <ul className="events">
                    {events.map((event, index) => (
                        <li
                            key={event.slug}
                            className={index === 0 ? "featured" : ""}
                        >
                            <EventCard {...event} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Page;
