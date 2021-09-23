import pino from "pino";
import createTask from "../../usecases/task-usecases/create.task.usecase";

/**
 * Creates a task
 * @param {*} httpRequest
 * @returns object containing the task details
 */

export default async function postTask(httpRequest) {
    const logger = pino({
        name: "post.task.controller",
    });
    const {
        headers: { correlationId },
        body: taskDetails,
    } = httpRequest;

    logger.info({
        correlationId,
        msg: "Started create task controller",
    });

    const response = await createTask(correlationId, taskDetails);

    logger.info({ correlationId, msg: "Task creation successful" });

    logger.info({ correlationId, msg: "Completed post task controller" });
    return {
        statusCode: 201,
        body: response,
    };
}
