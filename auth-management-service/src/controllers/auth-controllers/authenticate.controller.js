import pino from "pino";
import authenticateUser from "../../usecases/auth-usecases/authenticate.usecase";

/**
 * Authenticate user controller
 * @param {*} httpRequest
 * @returns object containing the response of authenticate user request
 */

export default async function authenticate(httpRequest) {
    const logger = pino({
        name: "authenticate.controller",
    });
    const {
        headers: { correlationId },
        body: loginDetails,
        query: { client_id: clientId, state, nounce },
    } = httpRequest;

    logger.info({ correlationId, msg: "Started register user controller" });

    const response = await authenticateUser(
        correlationId,
        { clientId, ...loginDetails },
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
