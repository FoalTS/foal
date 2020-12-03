/**
 * Sessions
 */

export const SESSION_DEFAULT_COOKIE_PATH: string = '/';
export const SESSION_DEFAULT_COOKIE_HTTP_ONLY: boolean = true;
export const SESSION_DEFAULT_COOKIE_NAME: string = 'sessionID';

export const SESSION_DEFAULT_CSRF_COOKIE_NAME: string = 'XSRF-TOKEN';
export const SESSION_DEFAULT_SAME_SITE_ON_CSRF_ENABLED: 'strict'|'lax'|'none' = 'lax';

// Expiration timeouts in seconds
export const SESSION_DEFAULT_INACTIVITY_TIMEOUT = 15 * 60; // 15 minutes
export const SESSION_DEFAULT_ABSOLUTE_TIMEOUT = 7 * 24 * 60 * 60; // 1 week

export const SESSION_DEFAULT_GARBAGE_COLLECTOR_PERIODICITY = 50;
