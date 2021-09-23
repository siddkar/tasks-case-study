import pino from "pino";

/**
 * Usecase to return userinfo
 * @param {string} correlationId
 * @param {[string]} scopes
 * @param {{ email: string, name: string }} data
 * @returns {{ email: string, name: string, scopes: [string] }} userinfo
 */
export default async function userinfo(correlationId, scopes, data) {
    const logger = pino({
        name: "userinfo.usecase",
    });
    logger.info({ correlationId, msg: "Started userinfo usecase" });

    // can add additional logic in future if required

    logger.info({ correlationId, msg: "Completed userinfo usecase" });

    return {
        ...data,
        scopes,
    };
}
