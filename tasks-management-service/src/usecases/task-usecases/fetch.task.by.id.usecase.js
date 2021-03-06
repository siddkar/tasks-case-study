import pino from "pino";
import { taskDb } from "../../data-access/db";
import buildTask from "../../entities/task";
import { ERROR_TYPE } from "../../shared/constants";

/**
 * Fetch a task by id
 * @param {*} correlationId
 * @param {*} id
 * @returns
 */
export default async function fetchTask(correlationId, id) {
    const logger = pino({
        name: "fetch.task.usecase",
    });
    logger.info({ correlationId, msg: "Started fetch task usecase" });

    logger.info({ correlationId, msg: "Check if task exists" });

    const task = await taskDb.findById(id);

    if (!task) {
        throw {
            type: ERROR_TYPE.ENTITY_NOT_FOUND,
            message: "Task not found",
            correlationId,
        };
    }
    logger.info({ correlationId, msg: "Completed fetch task usecase" });

    return buildTask(correlationId, {
        ...task._doc,
        id: task._doc._id,
    }).getTask();
}
