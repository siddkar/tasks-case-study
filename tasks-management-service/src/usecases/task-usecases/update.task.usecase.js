import pino from "pino";
import { taskDb } from "../../data-access/db";
import buildTask from "../../entities/task";
import { ERROR_TYPE } from "../../shared/constants";

/**
 * Update task By Id
 * @param {*} correlationId
 * @param {*} id
 * @returns
 */
export default async function updateTask(correlationId, id, taskUpdates) {
    const logger = pino({
        name: "update.task.usecase",
    });
    logger.info({ correlationId, msg: "Started update task usecase" });

    logger.info({ correlationId, msg: "Check if task exists" });
    const task = await taskDb.findById(id);

    if (!task) {
        throw {
            type: ERROR_TYPE.ENTITY_NOT_FOUND,
            message: "Task not found",
            correlationId,
        };
    }

    await taskDb.update(id, taskUpdates);

    logger.info({ correlationId, msg: "Completed update task usecase" });

    return buildTask(correlationId, { ...task, id: task._id, ...taskUpdates });
}
