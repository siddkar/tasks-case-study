import pino from "pino";
import refreshUserSession from "../../usecases/auth-usecases/refresh.session.usecase";

/**
 * Refresh token controller
 * @param {*} httpRequest
 * @returns object containing the response of authenticate user request
 */

export default async function refreshSession(httpRequest) {
    const logger = pino({
        name: "refresh.session.controller",
    });
    const {
        headers: { correlationId },
        query: { client_id: clientId, state, nounce },
        signedCookies: { sessionToken },
    } = httpRequest;

    logger.info({
        correlationId,
        msg: "Started refresh session controller",
        httpRequest,
    });

    const response = await refreshUserSession(
        correlationId,
        clientId,
        state,
        nounce,
        sessionToken
    );

    logger.info({ correlationId, msg: "User session refresh successful" });

    const { sessionToken: newSessionToken, ...body } = response;

    logger.info({ correlationId, msg: "Completed refresh session controller" });
    return {
        statusCode: 200,
        body,
        cookies: {
            sessionToken: newSessionToken,
        },
        clearCookiesIndicator: false,
    };
}
