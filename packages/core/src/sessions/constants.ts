/**
 * Sessions
 */

export const SESSION_DEFAULT_COOKIE_PATH: string = '/';
export const SESSION_DEFAULT_COOKIE_HTTP_ONLY: boolean = true;
export const SESSION_DEFAULT_COOKIE_NAME: string = 'sessionID';

// Expiration timeouts in seconds
export const SESSION_DEFAULT_INACTIVITY_TIMEOUT = 15 * 60; // 15 minutes
export const SESSION_DEFAULT_ABSOLUTE_TIMEOUT = 7 * 24 * 60 * 60; // 1 week
