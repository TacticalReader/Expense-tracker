// ── Global error handler middleware ───────────────────────────────
// Express calls this automatically when:
//   1. A route calls next(err)
//   2. An async route throws an error (Express 5 catches these)
//   3. Any synchronous throw in route/middleware
//
// Must be the LAST app.use() call in index.js
//
// @param {Error}  err  — the error object
// @param {object} req  — Express request
// @param {object} res  — Express response
// @param {Function} next — Express next (must be declared even if unused)
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
    // Always log the full error on the server for debugging
    console.error(`[ERROR] ${req.method} ${req.url}`)
    console.error(err.stack || err.message || err)

    // Determine the status code:
    // Use the error's own statusCode/status if set by a controller,
    // otherwise default to 500 Internal Server Error.
    const statusCode =
        err.statusCode ||
        err.status ||
        (res.statusCode !== 200 ? res.statusCode : 500)

    // Determine the message:
    // In production, hide internal error details from the client.
    // In development, show the actual error message for easier debugging.
    const message =
        process.env.NODE_ENV === 'production' && statusCode === 500
            ? 'An internal server error occurred.'
            : err.message || 'An unexpected error occurred.'

    res.status(statusCode).json({ message })
}

export default errorMiddleware