import pino from "pino";
import { taskDb } from "../../data-access/db";
import { ERROR_TYPE } from "../../shared/constants";

/**
 * Delete task By Id
 * @param {*} correlationId
 * @param {*} id
 * @returns
 */
export default async function removeTask(correlationId, id) {
    const logger = pino({
        name: "remove.task.usecase",
    });
    logger.info({ correlationId, msg: "Started remove task usecase" });

    logger.info({ correlationId, msg: "Check if task exists" });
    const task = await taskDb.findById(id);

    if (!task) {
        throw {
            type: ERROR_TYPE.ENTITY_NOT_FOUND,
            message: "Task not found",
            correlationId,
        };
    }

    await taskDb.deleteById(id);

    logger.info({ correlationId, msg: "Completed remove task usecase" });
}
