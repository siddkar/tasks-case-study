import pino from "pino";
import { TOKEN_TYPE } from "../constants";
import { verifyToken } from "../utils/jwt.utils";

export default function authMiddleware() {
    return function (req, res, next) {
        const logger = pino({
            name: "auth.middleware",
        });
        const {
            headers: { authorization, "x-correlation-id": correlationId },
        } = req;

        logger.info({ correlationId, msg: "Started auth middleware" });

        try {
            const decodedToken = verifyToken(
                correlationId,
                authorization.split(" ")[1],
                TOKEN_TYPE.ACCESS_TOKEN
            );
            req.userinfo = decodedToken;
            logger.info({ correlationId, msg: "Completed auth middleware" });
            return next();
        } catch (err) {
            logger.info({
                correlationId,
                msg: "Completed auth middleware with error",
                err,
            });

            return next(err);
        }
    };
}
