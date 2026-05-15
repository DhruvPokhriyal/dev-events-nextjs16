export interface Event {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

export const events: Event[] = [
    {
        title: "React Summit",
        image: "/images/event1.png",
        slug: "react-summit",
        location: "Amsterdam, Netherlands",
        date: "June 6-7, 2024",
        time: "09:00 AM - 06:00 PM",
    },
    {
        title: "Next.js Conf",
        image: "/images/event2.png",
        slug: "nextjs-conf",
        location: "San Francisco, CA",
        date: "October 21-22, 2024",
        time: "09:00 AM - 05:30 PM",
    },
    {
        title: "TechCrunch Disrupt",
        image: "/images/event3.png",
        slug: "techcrunch-disrupt",
        location: "San Francisco, CA",
        date: "September 9-11, 2024",
        time: "08:30 AM - 06:00 PM",
    },
    {
        title: "JavaScript.info Summit",
        image: "/images/event4.png",
        slug: "js-summit",
        location: "Berlin, Germany",
        date: "July 18-19, 2024",
        time: "10:00 AM - 05:00 PM",
    },
    {
        title: "Web Summit",
        image: "/images/event5.png",
        slug: "web-summit",
        location: "Lisbon, Portugal",
        date: "November 11-14, 2024",
        time: "09:00 AM - 06:30 PM",
    },
    {
        title: "GitHub Universe",
        image: "/images/event6.png",
        slug: "github-universe",
        location: "San Francisco, CA",
        date: "October 29-30, 2024",
        time: "08:30 AM - 05:00 PM",
    },
];
