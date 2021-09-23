import pino from "pino";
import { userPoolDb } from "../../data-access/db";
import { ERROR_TYPE, TOKEN_TYPE } from "../../shared/constants";
import { verifyToken } from "../../shared/utils/jwt.utils";

/**
 * Usecase to logout a user
 * @param {string} correlationId
 * @param {string} sessionToken
 */
export default async function logoutUser(correlationId, sessionToken) {
    const logger = pino({
        name: "logout.usecase",
    });
    logger.info({ correlationId, msg: "Started logout usecase" });

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

    logger.info({ correlationId, msg: "Removing session token a.k.a session" });

    await userPoolDb.update(foundUser.clientId, foundUser.email, {
        sessionTokenList: filteredSessions,
    });

    logger.info({ correlationId, msg: "Completed logout usecase" });
}
