import pino from "pino";
import fetchTask from "../../usecases/task-usecases/fetch.task.by.id.usecase";

/**
 * Get task by id controller
 * @param {*} httpRequest
 * @returns object containing the task details
 */

export default async function getTaskById(httpRequest) {
    const logger = pino({
        name: "get.task.by.id.controller",
    });
    const {
        headers: { correlationId },
        params: { id },
    } = httpRequest;

    logger.info({ correlationId, msg: "Started get task by id controller" });

    const response = await fetchTask(correlationId, id);

    logger.info({
        correlationId,
        msg: "Completed get task by id controller",
    });

    return {
        statusCode: 200,
        body: response,
    };
}
