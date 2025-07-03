/**
 * User roles in the system
 * @constant
 */
export const userRoles = {
  student: 'student',
  lecturer: 'lecturer',
  admin: 'admin'
};

/**
 * OTP types for different verification purposes
 * @constant
 */
export const otpTypes = {
  accountActivation: 'account-activation',
  passwordReset: 'password-reset'
};

/**
 * HTTP Status codes
 * @constant
 */
export const statusCodes = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  serverError: 500
};

/**
 * Common response messages
 * @constant
 */
export const messages = {
  success: 'Success',
  created: 'Created successfully',
  updated: 'Updated successfully',
  deleted: 'Deleted successfully',
  notFound: 'Resource not found',
  unauthorized: 'Unauthorized access',
  invalidCredentials: 'Invalid credentials'
};

/**
 * Pagination defaults
 * @constant
 */
export const paginationDefaults = {
  limit: 10,
  page: 1,
  sortBy: 'createdAt',
  sortOrder: 'desc'
};
