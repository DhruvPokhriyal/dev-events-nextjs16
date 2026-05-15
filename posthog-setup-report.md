<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent Next.js App Router project. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog on the client side using the Next.js 15.3+ `instrumentation-client` pattern. Configured with a reverse-proxy ingestion path (`/ingest`), exception capture for error tracking, and debug mode in development.
- **`next.config.ts`** (updated): Added reverse-proxy rewrites so PostHog requests route through `/ingest/*` (both static assets and event ingestion), plus `skipTrailingSlashRedirect: true`.
- **`components/ExploreBtn.tsx`** (updated): Added `posthog.capture('explore_events_clicked')` to the existing `onClick` handler.
- **`components/EventCard.tsx`** (updated): Added `"use client"` directive and `posthog.capture('event_card_clicked', { event_title, event_slug, event_location, event_date })` on the card link click.
- **`components/Navbar.tsx`** (updated): Added `"use client"` directive and `posthog.capture('nav_link_clicked', { label })` on each navigation link click.
- **`.env.local`** (new): PostHog public token and host stored as environment variables (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`).

| Event | Description | File |
|-------|-------------|------|
| `explore_events_clicked` | User clicks the 'Explore Events' CTA button on the homepage hero section | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view event details, capturing event title, slug, location, and date | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks a navigation link in the navbar, capturing the link label | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1589206)
- [Explore Events CTA Clicks](/insights/zpajnOEd) — daily trend of homepage hero button clicks
- [Event Card Clicks Over Time](/insights/xvmPoMHx) — daily trend of event card engagement
- [Most Clicked Events by Title](/insights/oBauUQpb) — bar chart of event card clicks broken down by event name
- [Nav Link Clicks by Label](/insights/MXh6cn7c) — bar chart of nav clicks broken down by link label
- [Total Engagement Overview](/insights/zrhywvFn) — all three events plotted side-by-side

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
