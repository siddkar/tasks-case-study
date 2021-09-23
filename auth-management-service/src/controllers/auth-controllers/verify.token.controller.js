import pino from "pino";
import userinfo from "../../usecases/auth-usecases/userinfo.usecase";

/**
 * Verify user controller
 * @param {*} httpRequest
 * @returns object containing the userinfo
 */

export default async function verifyToken(httpRequest) {
    const logger = pino({
        name: "verify.token.controller",
    });
    const {
        headers: { correlationId },
        userinfo: { data, scopes },
    } = httpRequest;

    logger.info({ correlationId, msg: "Started verify token controller" });

    const response = await userinfo(correlationId, scopes, data);

    logger.info({ correlationId, msg: "Fetched user info" });

    logger.info({ correlationId, msg: "Completed verify token controller" });
    return {
        statusCode: 200,
        body: response,
    };
}
