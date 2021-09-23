import pino from "pino";
import { v4 } from "uuid";

export default function correlationIdMiddleware() {
    return function (req, res, next) {
        const logger = pino({
            name: "correlation.id.middleware",
        });
        let correlationId = req.get("x-correlation-id");
        if (!correlationId) {
            correlationId = v4();
            req.headers["x-correlation-id"] = correlationId;
        }
        logger.info({
            correlationId,
            msg: `Correlation ID for the request: ${correlationId}`,
        });
        return next();
    };
}
