import pino from "pino";
import { taskDb } from "../../data-access/db";
import { ERROR_TYPE } from "../../shared/constants";

/**
 * Fetch a parcel by id
 * @param {*} correlationId
 * @param {*} id
 * @returns
 */
export default async function fetchtask(correlationId, id) {
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

    return task;
}
