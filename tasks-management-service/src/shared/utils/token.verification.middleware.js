import pino from "pino";
import axios from "axios";
import { ERROR_TYPE } from "../constants";

export default function tokenVerificationMiddleware(allowedScopes) {
    return async function (req, res, next) {
        const logger = pino({
            name: "token.verification.middleware",
        });
        let correlationId = req.get("x-correlation-id");
        try {
            const { data: userinfo } = await axios.post(
                `${process.env.AUTH_MANAGEMENT_SERVICE_URL}/verify-token`,
                null,
                {
                    headers: {
                        authorization: req.headers["authorization"],
                        "x-correlation-id": correlationId,
                    },
                }
            );

            let authorizedIndicator = false;
            userinfo.scopes.forEach((ele) => {
                if (allowedScopes.includes(ele)) {
                    authorizedIndicator = true;
                }
            });

            req.userinfo = userinfo;

            if (!authorizedIndicator) {
                throw {
                    type: ERROR_TYPE.FORBIDDEN,
                    message: `Forbidden user, invalid scope`,
                    forbiddenErrorType: "Forbidden",
                    correlationId,
                };
            }

            logger.info({
                correlationId,
                msg: `Correlation ID for the request: ${correlationId}`,
            });
            return next();
        } catch (err) {
            logger.info({
                correlationId,
                msg: "Completed token middleware with error",
                err,
            });

            if (err.response && err.response.status === 403) {
                return next({
                    type: ERROR_TYPE.FORBIDDEN,
                    message: `Forbidden user, ${err.response.data.errorMessage}`,
                    forbiddenErrorType: err.response.data.forbiddenErrorType,
                    correlationId,
                });
            }

            return next(err);
        }
    };
}
