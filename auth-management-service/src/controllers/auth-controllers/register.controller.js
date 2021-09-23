import pino from "pino";
import registerUser from "../../usecases/auth-usecases/register.usecase";

/**
 * Register user controller
 * @param {*} httpRequest
 * @returns object containing the response of register user request
 */

export default async function register(httpRequest) {
    const logger = pino({
        name: "register.controller",
    });
    const {
        headers: { correlationId },
        body: userDetails,
        query: { client_id: clientId, state, nounce },
    } = httpRequest;

    logger.info({ correlationId, msg: "Started register user controller" });

    const response = await registerUser(
        correlationId,
        { clientId, ...userDetails },
        state,
        nounce
    );

    logger.info({ correlationId, msg: "User registered successful" });

    const { sessionToken, ...body } = response;

    logger.info({ correlationId, msg: "Completed register user controller" });
    return {
        statusCode: 200,
        body,
        cookies: {
            sessionToken,
        },
        clearCookiesIndicator: false,
    };
}
