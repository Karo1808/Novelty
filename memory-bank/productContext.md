2025-04-10 15:22:29 - Memory Bank Update (UMB) in progress. Updating productContext.md.
# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.
YYYY-MM-DD HH:MM:SS - Initial population based on project documents.

-

## Project Goal

Novelty is designed to help users track their reading habits, discover other people's opinions on books, and connect with fellow literature enthusiasts.

## Key Features

*   **Personalized Recommendations:**
    *   Book recommendations based on prior reads.
    *   Buddy read suggestions for books in the user's TBR or related to their reading list.
    *   Recommendations of popular books and those recommended by fellow readers.
    *   Personalized discovery page for exploring new genres.
*   **Extensive Book Library:**
    *   Large and concurrent library of books with search and filter options.
    *   Option to add missing books or cover editions.
    *   Filtering through book metadata for easy discovery.
    *   Ability to view books read or added to TBR by friends.
    *   Access to book summaries and metadata.
    *   Page showcasing the newest book releases.
*   **Review and Rating System:**
    *   Review system for authors, series, books, and chapters.
    *   Moderated reviews with a report system to prevent spoilers.
    *   Ability to format reviews and share them on social media.
    *   Rating calculated using platform averages.
*   **Reading List Tracking and Statistics:**
    *   Ability to track read literature and view statistics.
    *   Filterable reading lists.
    *   Stats with graphs based on various criteria.
    *   Option to receive summaries to mailbox for sharing.
*   **Notifications:**
    *   Notifications based on user settings (e.g., new releases by favorite authors, friends finishing books, viral reviews).
*   **To-Be-Read Lists:**
    *   Ability to create TBR lists and mark books with specific dates.
    *   Interactive calendar for planning reading journey.
    *   Notifications and rewards for making progress in TBR.
*   **Social Interaction:**
    *   View other people's updates (if configured).
    *   Make friends and send invites through connected social media.
    *   Create buddy reads for reading and discussing books together.
    *   Share recommendations with others.
*   **Profile Customization:**
    *   Ability to customize profile preferences, including:
        *   Notifications
        *   Visibility to others
        *   Appearance

## Overall Architecture

*   **Monorepo:** Managed by Turborepo, containing separate applications and shared packages.
    *   **Frontend (`web`):** Next.js 15 (App Router), TailwindCSS, Shadcn UI, Tanstack Query, React Hook Form, Zod.
    *   **Backend (`api`):** Hono framework on Node.js, Typescript.
    *   **Database:** PostgreSQL (primary data) managed via DrizzleORM, Redis (caching, sessions, rate limiting, queues) managed via ioredis.
    *   **Asynchronous Tasks:** BullMQ for background jobs (e.g., emails), node-cron for scheduled tasks.
    *   **File Storage:** AWS S3 for user uploads (e.g., profile pictures).
    *   **Authentication:** Session-based with cookies stored in Redis.
    *   **Deployment:** Frontend initially on Vercel, Backend potentially on Digital Ocean (Docker).
    *   **Monitoring:** Prometheus (metrics), Loki (logs), Sentry (errors), visualized in Grafana.
    *   **CI/CD:** GitHub Actions for automated testing and builds.


