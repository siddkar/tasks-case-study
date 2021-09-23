import pino from "pino";
import { ERROR_TYPE, HTTP_ERROR_CODE } from "../constants";

/**
 * Error handler middleware
 * @returns {function} a callback handling error scenarios and returning response
 */
export default function httpErrorHandlerMiddleware() {
    return function cb(err, req, res, next) {
        const logger = pino({
            name: "http.error.handler.middleware",
        });
        const correlationId = req.headers["x-correlation-id"];

        // Handle unauthorized request
        if (err.type === ERROR_TYPE.UNAUTHORIZED) {
            const errorResponse = {
                errorCode: HTTP_ERROR_CODE["401_UNAUTHORIZED"],
                correlationId,
                errorMessage: "Unauthorized user.",
            };
            logger.error({
                correlationId,
                errorResponse,
                msg: "Error Response",
            });
            return res.status(401).json(errorResponse);
        }

        // Handle unauthorized request
        if (err.type === ERROR_TYPE.FORBIDDEN) {
            const errorResponse = {
                errorCode: HTTP_ERROR_CODE["403_FORBIDDEN"],
                correlationId,
                errorMessage: "Forbidden user.",
                forbiddenErrorType: err.forbiddenErrorType,
            };
            logger.error({
                correlationId,
                errorResponse,
                msg: "Error Response",
            });
            return res.status(403).json(errorResponse);
        }

        // Handle bad request
        if (err.type === ERROR_TYPE.BAD_DATA) {
            const errorResponse = {
                errorCode: HTTP_ERROR_CODE["400_BAD_REQUEST"],
                correlationId,
                errorMessage: "Bad / Invalid Request.",
                errorList: err.errorList,
            };
            logger.error({
                correlationId,
                errorResponse,
                msg: "Error Response",
            });
            return res.status(400).json(errorResponse);
        }

        // Handle entity not found
        if (err.type === ERROR_TYPE.ENTITY_NOT_FOUND) {
            const errorResponse = {
                errorCode: HTTP_ERROR_CODE["404_NOT_FOUND"],
                correlationId,
                errorMessage: "Entity is not found.",
            };
            logger.error({
                correlationId,
                errorResponse,
                msg: "Error Response",
            });
            return res.status(404).json(errorResponse);
        }

        // Handle conflict
        if (err.type === ERROR_TYPE.CONFLICT) {
            const errorResponse = {
                errorCode: HTTP_ERROR_CODE["409_CONFLICT"],
                correlationId,
                errorMessage: err.message,
            };
            logger.error({
                correlationId,
                errorResponse,
                msg: "Error Response",
            });
            return res.status(409).json(errorResponse);
        }

        // Handle any other error
        const errorResponse = {
            errorCode: HTTP_ERROR_CODE["500_INTERNAL_SERVER_ERROR"],
            correlationId,
            errorMessage: err.message,
        };
        logger.error({
            correlationId,
            errorResponse,
            msg: "Error Response",
        });
        return res.status(500).json(errorResponse);
    };
}
