import pino from "pino";
import searchTasks from "../../usecases/task-usecases/search.tasks.usecase";

/**
 * Get tasks based on search criteria
 * @param {*} httpRequest
 * @returns task list
 */

export default async function getTasks(httpRequest) {
    const logger = pino({
        name: "get.tasks.controller",
    });
    const {
        headers: { correlationId },
        query: { isCompleted, title, taskExecutionTimestamp },
    } = httpRequest;

    logger.info({ correlationId, msg: "Started get tasks controller" });

    const response = await searchTasks(correlationId, {
        title,
        taskExecutionTimestamp,
        isCompleted,
    });

    logger.info({
        correlationId,
        msg: "Completed get tasks controller",
    });

    return {
        statusCode: 200,
        body: response,
    };
}
