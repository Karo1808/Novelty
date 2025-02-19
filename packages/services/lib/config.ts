export const VERIFICATION_EMAIL_TOKEN_LENGTH = 5 as const;
export const VERIFICATION_EMAIL_EXPIRY_TIME = 15 * 60;

export const EMAIL_QUEUE_COMPLETED_JOBS_LIMIT = 1000 as const;
export const EMAIL_QUEUE_REMOVED_JOBS_LIMIT = 5000 as const;
export const EMAIL_QUEUE_COMPLETED_JOBS_TIME = 3600 * 24; // 24 hours
export const EMAIL_QUEUE_REMOVED_JOBS_TIME = 3600 * 5; // 5 hours

export const USER_INFO_DRAFT_KEY = `user-info-draft` as const;
