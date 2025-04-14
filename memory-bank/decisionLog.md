2025-04-10 15:20:59 - Memory Bank Update (UMB) performed. No significant decisions in current session.
# Decision Log

This file tracks key architectural and design decisions made during the project.
YYYY-MM-DD HH:MM:SS - Log of updates made.

-

## Decisions

[2025-04-10 21:32:20] - Decision to perform comprehensive Memory Bank update (UMB) to ensure all project documentation remains synchronized. This includes reviewing and updating all context files (productContext.md, activeContext.md, systemPatterns.md, decisionLog.md, progress.md) to reflect current project state.

[2025-04-10 18:33:18] - Refactored `forgotPassword` in `auth.service.ts` to improve atomicity. Decision: Perform the database password update *before* deleting the Redis password reset token. This prevents the token from being invalidated if the critical DB update fails, allowing retries. Subsequent Redis/session errors after successful DB update are logged but treated as non-critical for the core password reset success.

[2025-04-14 1:00:11] - Decision: Switched from `insert_content` to `apply_diff` for adding test blocks to `auth.endpoints.test.ts` due to repeated failures likely caused by concurrent file modifications making line numbers unreliable. `apply_diff` uses content search, making it more resilient.
The project uses a monorepo architecture with Turborepo. It includes the following apps and packages:
[2025-04-14 1:08:52] - Decision: Implemented error path tests for `/forgot-password` by mocking specific service dependencies (`queries.updateUserByIdQuery`, `redisQueries.deleteByKey`, `authUtils.encodeToken`) to throw errors at distinct points in the execution flow (DB update failure, Redis deletion failure, unexpected early error).

- `api`: A Next.js app that serves as the API.
- `email-sender`: A worker that sends emails.
- `@novelty/db`: A package for database access.
- `@novelty/email`: A package for sending emails.
- `@novelty/lib`: A package for utility functions.
- `@novelty/message-queue`: A package for message queueing.
- `@novelty/redis`: A package for Redis access.
- `@novelty/services`: A package for business logic services.

The `api` app uses the following dependencies:
- `@asteasolutions/zod-to-openapi`: For generating OpenAPI specifications from Zod schemas.
- `@hono/node-server`: For running the Hono app on Node.js.
- `@hono/prometheus`: For exposing Prometheus metrics.
- `@hono/sentry`: For integrating with Sentry.
- `@hono/zod-openapi`: For integrating Zod schemas with OpenAPI.
- `@novelty/db`: For database access.
- `@novelty/email`: For sending emails.
- `@novelty/lib`: For utility functions.
- `@novelty/message-queue`: For message queueing.
- `@novelty/redis`: For Redis access.
- `@novelty/services`: For business logic services.
- `@scalar/hono-api-reference`: For generating API reference documentation.
- `@sentry/cli`: For Sentry CLI.
- `@sentry/node`: For Sentry Node.js integration.
- `@sentry/profiling-node`: For Sentry profiling.
- `dayjs`: For date manipulation.
- `dotenv`: For loading environment variables.
- `dotenv-expand`: For expanding environment variables.
- `hono`: For building web applications.
- `hono-pino`: For integrating Hono with Pino logger.
- `hono-rate-limiter`: For rate limiting.
- `js-yaml`: For parsing YAML files.
- `node-cron`: For scheduling cron jobs.
- `pino`: For logging.
- `pino-loki`: For sending logs to Loki.
- `pino-pretty`: For pretty-printing logs.
- `prom-client`: For Prometheus client.
- `rate-limit-redis`: For rate limiting with Redis.
- `zod`: For schema validation.

The `email-sender` app uses the following dependencies:
- `@novelty/email`: For sending emails.
- `@novelty/lib`: For utility functions.
- `@novelty/message-queue`: For message queueing.
- `bullmq`: For message queueing with BullMQ.
- `dotenv`: For loading environment variables.
- `dotenv-expand`: For expanding environment variables.
- `prom-client`: For Prometheus client.
- `react`: For building UI components.
- `react-dom`: For rendering UI components.
- `zod`: For schema validation.
