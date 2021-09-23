import pino from "pino";
import { userPoolDb } from "../../data-access/db";
import { ERROR_TYPE, TOKEN_TYPE } from "../../shared/constants";
import {
    generateAccessToken,
    generateSessionToken,
    verifyToken,
} from "../../shared/utils/jwt.utils";

/**
 * Usecase to refresh a user session and return a access and session token
 * @param {string} correlationId
 * @param {string} loginDetails
 * @param {string} state
 * @param {string} nounce
 * @param {string} sessionToken
 * @returns object containing access token & session token
 */
export default async function refreshUserSession(
    correlationId,
    clientId,
    state,
    nounce,
    sessionToken
) {
    const logger = pino({
        name: "refresh.session.usecase",
    });
    logger.info({ correlationId, msg: "Started refresh session usecase" });

    if (!sessionToken) {
        logger.error({
            correlationId,
            msg: "Unauthorized user, Bad request session token is missing",
        });
        throw {
            type: ERROR_TYPE.UNAUTHORIZED,
            message: "Unauthorized user, session token missing",
            correlationId,
        };
    }

    const decodedToken = verifyToken(
        correlationId,
        sessionToken,
        TOKEN_TYPE.SESSION_TOKEN
    );

    if (!clientId || clientId !== decodedToken.clientId) {
        logger.error({
            correlationId,
            msg: "Unauthorized user, Invalid client id",
        });
        throw {
            type: ERROR_TYPE.UNAUTHORIZED,
            message: "Unauthorized user",
            correlationId,
        };
    }

    logger.info({ correlationId, msg: "Check if user exists" });
    const foundUser = await userPoolDb.findById(
        decodedToken.clientId,
        decodedToken.email
    );

    const filteredSessions = foundUser.sessionTokenList.filter(
        (ele) => ele !== sessionToken
    );

    if (
        !foundUser ||
        filteredSessions.length === foundUser.sessionTokenList.length
    ) {
        throw {
            type: ERROR_TYPE.UNAUTHORIZED,
            message: "Unauthorized user, user or active session not found",
            correlationId,
        };
    }

    logger.info({ correlationId, msg: "Session Verified, Generating tokens" });

    const newSessionToken = generateSessionToken(foundUser);
    const accessToken = generateAccessToken(foundUser, nounce);

    await userPoolDb.update(foundUser.clientId, foundUser.email, {
        sessionTokenList: [...foundUser.sessionTokenList, newSessionToken],
    });

    logger.info({ correlationId, msg: "Completed refresh token usecase" });

    return {
        accessToken,
        state,
        tokenType: "bearer",
        expiresIn: eval(process.env.ACCESS_TOKEN_EXPIRY),
        sessionToken: newSessionToken,
    };
}
