import User, { IUser } from '../../models/userModel'

/**
 * Creates a new user with the provided username and password.
 *
 * @param {string} username - The username of the new user.
 * @param {string} password - The password of the new user.
 * @returns {Promise<IUser>} - Promise resolving to the newly created user.
 */
export const createUser = async (
  username: string,
  password: string,
): Promise<IUser> => {
  // Create a new user instance with the provided username and password
  const user: IUser = new User({ username, password })

  // Save the new user to the database and return the result
  return await user.save()
}

/**
 * Finds a user by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<IUser | null>} - Promise resolving to the found user or null if not found.
 */
export const findUserByUsername = async (
  username: string,
): Promise<IUser | null> => {
  // Find and return the user with the provided username from the database
  return await User.findOne({ username })
}

/**
 * Finds a user by their email address.
 *
 * @param {string} email - The email address of the user to find.
 * @returns {Promise<IUser | null>} - Promise resolving to the found user or null if not found.
 */
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  // Find and return the user with the provided email address from the database
  return await User.findOne({ email })
}
