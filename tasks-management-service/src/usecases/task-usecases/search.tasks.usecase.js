import pino from "pino";
import { taskDb } from "../../data-access/db";
import buildTask from "../../entities/task";
import { ERROR_TYPE } from "../../shared/constants";

/**
 * Seach tasks based on search params
 * @param {*} correlationId
 * @param {*} searchParams
 * @returns a list of task
 */

export default async function searchTasks(correlationId, searchParams) {
    const logger = pino({
        name: "search.tasks.usecase",
    });
    logger.info({ correlationId, msg: "Started search tasks usecase" });

    logger.info({ correlationId, msg: "Check if tasks exists" });

    const tasks = await taskDb.find();

    if (!tasks.length) {
        throw {
            type: ERROR_TYPE.ENTITY_NOT_FOUND,
            message: "Tasks not found",
            correlationId,
        };
    }

    if (Object.keys(searchParams).length) {
        const filteredTasks = tasks.filter((ele) => {
            let condition = true;

            if (searchParams.isCompleted) {
                condition =
                    condition && searchParams.isCompleted == "false"
                        ? !ele._doc.isCompleted
                        : ele._doc.isCompleted;
            }
            if (searchParams.title) {
                condition =
                    condition && ele._doc.title.includes(searchParams.title);
            }
            if (searchParams.taskExecutionTimestamp) {
                condition =
                    condition &&
                    new Date(
                        searchParams.taskExecutionTimestamp
                    ).toDateString() ===
                        new Date(
                            ele._doc.taskExecutionTimestamp
                        ).toDateString();
            }
            return condition;
        });
        if (!filteredTasks.length) {
            throw {
                type: ERROR_TYPE.ENTITY_NOT_FOUND,
                message: "Tasks not found",
                correlationId,
            };
        }
        return filteredTasks.map((ele) =>
            buildTask(correlationId, {
                ...ele._doc,
                id: ele._doc._id,
            }).getTask()
        );
    }

    logger.info({ correlationId, msg: "Completed search tasks usecase" });
    return tasks.map((ele) =>
        buildTask(correlationId, {
            ...ele._doc,
            id: ele._doc._id,
        }).getTask()
    );
}
