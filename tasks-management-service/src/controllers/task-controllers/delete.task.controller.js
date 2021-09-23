import pino from "pino";
import removeTask from "../../usecases/task-usecases/update.task.usecase";

/**
 * Deletes a task
 * @param {*} httpRequest
 */

export default async function deleteTask(httpRequest) {
    const logger = pino({
        name: "patch.task.controller",
    });
    const {
        headers: { correlationId },
        params: { id },
    } = httpRequest;

    logger.info({
        correlationId,
        msg: "Started delete task controller",
    });

    await removeTask(correlationId, id);

    logger.info({ correlationId, msg: "Task deleted successful" });

    logger.info({ correlationId, msg: "Completed delete task controller" });
    return {
        statusCode: 204,
    };
}
