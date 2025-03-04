
const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

const USER_MSG = {
    ALREADY_EXISTS: "User with this email already exists",
    NOT_FOUND: "User not found",
    CREATED: "User created successfully",
    UPDATED: "User updated successfully",
    DELETED: "User deleted successfully",
    INVALID_CREDENTIALS: "Invalid email or password",
    UNAUTHORIZED: "Unauthorized access",
    EMAIL_REQUIRED: "Email is required",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_UPDATED: "Password is updated successfully",
    LOGGED_IN:"User logged in successfully",
    OTP_SEND:"OTP successfully send to the mail",
    OTP_DATABASE_ERROR:"Error while storing OTP in database"
};

const PRODUCT_MSG = {
    NOT_FOUND: "Product not found",
    CREATED: "Product created successfully",
    UPDATED: "Product updated successfully",
    DELETED: "Product deleted successfully",
    OUT_OF_STOCK: "Product is out of stock"
};

const ERROR_MESSAGES = {
    VALIDATION_ERROR: "Validation failed",
    SERVER_ERROR: "Something went wrong on the server",
    INVALID_REQUEST: "Invalid request parameters",
    DATABASE_ERROR: "Database operation failed"
};

const SUCCESS_MESSAGES = {
    OPERATION_SUCCESS: "Operation completed successfully"
};

// Export all constants as a single object
module.exports = {
    STATUS_CODES,
    USER_MSG,
    ERROR_MESSAGES,
    PRODUCT_MSG,
    SUCCESS_MESSAGES
};