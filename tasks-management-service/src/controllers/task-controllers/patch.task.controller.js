import pino from "pino";
import updateTask from "../../usecases/task-usecases/update.task.usecase";

/**
 * Updates a task
 * @param {*} httpRequest
 * @returns object containing the updated task details
 */

export default async function patchTask(httpRequest) {
    const logger = pino({
        name: "patch.task.controller",
    });
    const {
        headers: { correlationId },
        params: { id },
        body: taskUpdates,
    } = httpRequest;

    logger.info({
        correlationId,
        msg: "Started patch task controller",
    });

    const response = await updateTask(correlationId, id, taskUpdates);

    logger.info({ correlationId, msg: "Task updated successful" });

    logger.info({ correlationId, msg: "Completed patch task controller" });
    return {
        statusCode: 200,
        body: response,
    };
}
