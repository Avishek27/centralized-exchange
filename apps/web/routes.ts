/**
 * An array of routes that are accessible to everyone
 * These routes do not need authentication
 * @type {string[]}
 */

export const publicRoutes = [
    "/"
]
/**
 * An array of routes that are accessible to everyone
 * These routes redirect to authentication
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
]

/**
 * The prefix for API authentication routes
 * Routes that start with these prefix are used for API authentication purpose
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * The default path after login redirect
 * @type {string}
 */


export const DEFAULT_LOGIN_REDIRECT = "/market";