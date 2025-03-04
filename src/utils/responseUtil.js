

/**
 * Standard success response
 * @param {Response} res - Express response object
 * @param {any} data - Response data
 * @param {string} [message] - Success message
 * @param {number} [statusCode] - HTTP status code (default: 200)
 */
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Standard error response
 * @param {Response} res - Express response object
 * @param {string} [message] - Error message
 * @param {number} [statusCode] - HTTP status code (default: 500)
 * @param {any} [error] - Error details
 */
const sendError = (res, message = 'Something went wrong', statusCode = 500, error = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: error ? error.message || error : null
    });
};

module.exports = {
    sendSuccess,
    sendError
};