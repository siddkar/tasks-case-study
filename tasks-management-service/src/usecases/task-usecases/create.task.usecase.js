import pino from "pino";
import buildTask from "../../entities/task";
import { taskDb } from "../../data-access/db";

/**
 * Usecase to create task
 * @param {*} correlationId
 * @param {*} taskDetails
 * @returns
 */
export default async function createTask(correlationId, taskDetails) {
    const logger = pino({
        name: "create.task.usecase",
    });
    logger.info({ correlationId, msg: "Started create parcel usecase" });

    logger.info({ correlationId, msg: "Build task" });

    const task = buildTask(correlationId, { ...taskDetails }).gettask();

    logger.info({ correlationId, msg: "Validations complete" });

    logger.info({ correlationId, msg: "Save task to task DB" });

    await taskDb.insert(task);

    logger.info({ correlationId, msg: "Completed task usecase" });

    return parcel;
}
