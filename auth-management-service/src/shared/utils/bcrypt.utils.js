import bcrypt from "bcryptjs";

/**
 * Generates password hash using bcrypt
 * @param {string} password
 * @returns {string} password hash
 */
export const generatePasswordHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

/**
 * Checks if entered password is correct or not by comparing with password hash
 * @param {string} password
 * @param {string} passwordHash
 * @returns {boolean}
 */
export const isValidPassword = async (password, passwordHash) => {
    return await bcrypt.compare(password, passwordHash);
};
