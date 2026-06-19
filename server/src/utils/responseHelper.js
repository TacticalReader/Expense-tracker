// ── sendSuccess ───────────────────────────────────────────────────
// Sends a successful JSON response with the given data and status code.
// data can be: an array, an object, or any JSON-serializable value.
//
// @param {object} res        — Express response object
// @param {*}      data       — The data to send as the response body
// @param {number} statusCode — HTTP status code (default 200)
export const sendSuccess = (res, data, statusCode = 200) => {
    res.status(statusCode).json(data)
}

// ── sendError ─────────────────────────────────────────────────────
// Sends a JSON error response with a { message } body.
// The frontend response interceptor reads error.response.data.message
//
// @param {object} res        — Express response object
// @param {string} message    — Human-readable error description
// @param {number} statusCode — HTTP status code (default 500)
export const sendError = (res, message, statusCode = 500) => {
    res.status(statusCode).json({ message })
}