import { IUser } from '../models/userModel'

/**
 * Sanitizes a user object by extracting only the username and id fields.
 *
 * @param {IUser} user - The user object to sanitize.
 * @returns {{ username: string; id: string }} - The sanitized user object with only the username and id fields.
 */
export const sanitizeUser = (user: IUser): { username: string; id: string } => {
  // Extract the username and id fields from the user object
  const { username, id } = user

  // Return a new object containing only the username and id fields
  return { username, id }
}
