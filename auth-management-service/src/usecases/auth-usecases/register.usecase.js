import pino from "pino";
import buildUser from "../../entities/user";
import { userPoolDb } from "../../data-access/db";
import {
    generateAccessToken,
    generateSessionToken,
} from "../../shared/utils/jwt.utils";
import { generatePasswordHash } from "../../shared/utils/bcrypt.utils";
import { ERROR_TYPE } from "../../shared/constants";

/**
 * Usecase to register a user in the database and return a access and refresh token
 * @param {string} correlationId
 * @param {*} userDetail
 * @param {string} state
 * @param {string} nounce
 * @returns {Object} containing access token & refresh token
 */
export default async function registerUser(
    correlationId,
    userDetail,
    state,
    nounce
) {
    const logger = pino({
        name: "register.usecase",
    });
    logger.info({ correlationId, msg: "Started register user usecase" });

    logger.info({ correlationId, msg: "Build User" });
    const user = buildUser(correlationId, userDetail).getUser();

    if (
        !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(
            userDetail.password
        )
    ) {
        throw {
            type: ERROR_TYPE.BAD_DATA,
            errorList: [
                "Password should be 8 to 16 characters long and should have at least a number, and at least a special character",
            ],
            correlationId,
        };
    }

    if (userDetail.password !== userDetail.confirmPassword) {
        throw {
            type: ERROR_TYPE.BAD_DATA,
            errorList: ["Password and Confirm Password are not matching"],
            correlationId,
        };
    }

    logger.info({ correlationId, msg: "Validations complete" });

    const foundUser = await userPoolDb.findById(user.clientId, user.email);
    if (foundUser) {
        throw {
            type: ERROR_TYPE.CONFLICT,
            message: `User with email ${user.email} already exists`,
            correlationId,
        };
    }

    logger.info({ correlationId, msg: "Generate tokens" });

    const sessionToken = generateSessionToken(user);
    const accessToken = generateAccessToken(user, nounce);

    logger.info({ correlationId, msg: "Save user to user pool DB" });

    user.password = await generatePasswordHash(user.password);

    await userPoolDb.insert(user);

    logger.info({ correlationId, msg: "Completed register user usecase" });
    return {
        accessToken,
        state,
        tokenType: "bearer",
        expiresIn: eval(process.env.ACCESS_TOKEN_EXPIRY),
        sessionToken,
    };
}
