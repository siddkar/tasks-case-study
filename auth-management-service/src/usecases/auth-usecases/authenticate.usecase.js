import pino from "pino";
import { userPoolDb } from "../../data-access/db";
import { ERROR_TYPE } from "../../shared/constants";
import { isValidPassword } from "../../shared/utils/bcrypt.utils";
import {
    generateAccessToken,
    generateSessionToken,
} from "../../shared/utils/jwt.utils";

/**
 * Usecase to authenticate a user in the database and return a access and refresh token
 * @param {string} correlationId
 * @param {{ email: string, password: string, clientId: string }} loginDetails
 * @param {string} state
 * @param {string} nounce
 * @returns object containing access token & refresh token
 */
export default async function authenticateUser(
    correlationId,
    loginDetails,
    state,
    nounce
) {
    const logger = pino({
        name: "authenticate.usecase",
    });
    logger.info({ correlationId, msg: "Started authenticate user usecase" });

    if (
        !loginDetails.clientId ||
        !loginDetails.email ||
        !loginDetails.password
    ) {
        logger.error({
            correlationId,
            msg: "Unauthorized user, Bad request either clientId or email or password missing",
            isVerifiedIndicator,
        });
        throw {
            type: ERROR_TYPE.UNAUTHORIZED,
            message: "Unauthorized user",
            correlationId,
        };
    }

    logger.info({ correlationId, msg: "Check if user exists" });
    const foundUser = await userPoolDb.findById(
        loginDetails.clientId,
        loginDetails.email
    );
    if (!foundUser) {
        throw {
            type: ERROR_TYPE.UNAUTHORIZED,
            message: "Unauthorized user",
            correlationId,
        };
    }

    logger.info({ correlationId, msg: "User found, Verifying password" });
    const isVerifiedIndicator = await isValidPassword(
        loginDetails.password,
        foundUser.password
    );

    if (!isVerifiedIndicator) {
        logger.error({
            correlationId,
            msg: "Unauthorized user, Incorrect password",
            isVerifiedIndicator,
        });
        throw {
            type: ERROR_TYPE.UNAUTHORIZED,
            message: "Unauthorized user",
            correlationId,
        };
    }

    logger.info({ correlationId, msg: "User Verified, Generating tokens" });

    const sessionToken = generateSessionToken(foundUser);
    const accessToken = generateAccessToken(foundUser, nounce);

    foundUser.sessionTokenList.push(sessionToken);

    await userPoolDb.insert(foundUser);

    logger.info({ correlationId, msg: "Completed authenticate user usecase" });

    return {
        accessToken,
        state,
        tokenType: "bearer",
        expiresIn: eval(process.env.ACCESS_TOKEN_EXPIRY),
        sessionToken,
    };
}
