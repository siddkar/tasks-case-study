import pino from "pino";
import { ERROR_TYPE, SCOPE } from "../shared/constants";

/**
 * Build an user entity
 * @returns user entity
 */
export default function buildUser(
    correlationId,
    { clientId, email, password, name, sessionTokenList = [] }
) {
    const logger = pino({
        name: "user.entity",
    });
    const errorList = [];
    if (!clientId || process.env.CLIENT_ID !== clientId) {
        errorList.push({
            fieldName: "client_id",
            message: "Client ID should be valid",
        });
    }
    if (
        !email ||
        !/^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(
            email
        )
    ) {
        errorList.push({
            fieldName: "email",
            message: "Email should be valid",
        });
    }
    if (!password) {
        errorList.push({
            fieldName: "password",
            message: "Password should be valid",
        });
    }
    if (!name || !/^[a-zA-Z ]{1,100}$/.test(name)) {
        errorList.push({
            fieldName: "name",
            message: "Name should be valid",
        });
    }

    if (errorList.length) {
        logger.error({ correlationId, errorList, msg: "Bad Request" });
        throw { type: ERROR_TYPE.BAD_DATA, errorList, correlationId };
    }

    const scopes = [SCOPE.READ, SCOPE.READ_WRITE];

    return Object.freeze({
        getUser: () => ({
            clientId,
            email,
            name,
            password,
            scopes,
            sessionTokenList,
        }),
        getUserinfo: () => ({
            email,
            name,
        }),
    });
}
