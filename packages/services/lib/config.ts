export const VERIFICATION_EMAIL_TOKEN_LENGTH = 5 as const;
export const VERIFICATION_EMAIL_EXPIRY_TIME = 15 * 60;
export const LOCK_TTL = 5 * 60;

export const EMAIL_QUEUE_COMPLETED_JOBS_LIMIT = 1000 as const;
export const EMAIL_QUEUE_REMOVED_JOBS_LIMIT = 5000 as const;
export const EMAIL_QUEUE_COMPLETED_JOBS_TIME = 3600 * 24; // 24 hours
export const EMAIL_QUEUE_REMOVED_JOBS_TIME = 3600 * 5; // 5 hours

export const SESSION_KEY_PREFIX = "session:" as const;
export const USER_SESSIONS_KEY_PREFIX = "user_sessions:" as const;

export const PROFILE_PICTURES_PATH_PREFIX = "profile_pictures/" as const;

export const USER_INFO_DRAFT_KEY = `user-info-draft` as const;

export const R2_SIGNED_URL_EXPIRATION = 60 * 60 * 24; // 24 hours

export const MIN_REQUIRED_GENRES = 3;

export const DUMMY_PASSWORD = "dummy_password" as string;
export const DUMMY_PASSWORD_HASH
  = "$argon2id$v=19$m=65536,t=3,p=4$YWFhYWFhYWFhYWFhYWFhYQ$幌幌幌幌幌幌幌幌幌幌幌幌幌幌幌幌幌幌幌幌幌" as const;

export const FORGOT_PASSWORD_EMAIL_EXPIRY_TIME = 15 * 60; // 15 minutes

export const BLACKLIST_KEY = "blacklist" as const;
