import pino from "pino";
import logoutUser from "../../usecases/auth-usecases/logout.usecase";

/**
 * Logout controller
 * @param {*} httpRequest
 * @returns
 */

export default async function logout(httpRequest) {
    const logger = pino({
        name: "logout.controller",
    });
    const {
        headers: { correlationId },
        signedCookies: { sessionToken },
    } = httpRequest;

    logger.info({
        correlationId,
        msg: "Started logout controller",
    });

    await logoutUser(correlationId, sessionToken);

    logger.info({ correlationId, msg: "Logout successful" });

    logger.info({ correlationId, msg: "Ended logout controller" });
    return {
        statusCode: 200,
        body: {
            message: "User logged out",
        },
        clearCookiesIndicator: true,
        clearCookieList: ["sessionToken"],
    };
}
