import jwt from "jsonwebtoken";
import { TOKEN_TYPE, ERROR_TYPE } from "../constants";

/**
 * Generates a signed JWT token, i.e, (accessToken)
 * @param {*} userDetails
 * @param {*} nounce
 * @returns access token
 */
export const generateAccessToken = (
    { clientId, email, name, scope, userType },
    nounce
) => {
    return jwt.sign(
        {
            clientId,
            userType,
            nounce,
            scopes: [scope],
            data: {
                email,
                name,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: eval(process.env.ACCESS_TOKEN_EXPIRY),
            audience: "auth.optilzy.com",
            issuer: "optilzy.com",
        }
    );
};

/**
 * Generates a signed JWT token, i.e, (sessionToken)
 * @param {*} userDetails
 * @returns session token
 */
export const generateSessionToken = ({ clientId, email }) => {
    const sessionToken = jwt.sign(
        { clientId, email },
        process.env.SESSION_TOKEN_SECRET,
        {
            expiresIn: eval(process.env.SESSION_TOKEN_EXPIRY),
            audience: "auth.optilzy.com",
            issuer: "optilzy.com",
        }
    );
    return sessionToken;
};

/**
 * Verifies a signed JWT token
 * @param {*} correlationId
 * @param {*} token
 * @param {*} tokenType
 * @returns decoded token or an error
 */
export const verifyToken = (correlationId, token, tokenType) => {
    let secret = process.env.ACCESS_TOKEN_SECRET;
    if (tokenType === TOKEN_TYPE.SESSION_TOKEN) {
        secret = process.env.SESSION_TOKEN_EXPIRY;
    }
    try {
        const decodedToken = jwt.verify(token, secret);
        return decodedToken;
    } catch (err) {
        throw {
            type: ERROR_TYPE.FORBIDDEN,
            message: `Forbidden user, ${err.message}`,
            forbiddenErrorType: err.name,
            correlationId,
        };
    }
};
