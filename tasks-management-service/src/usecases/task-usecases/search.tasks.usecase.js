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

    if (!tasks) {
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
                    condition && searchParams.isCompleted == ele.isCompleted;
            }
            if (searchParams.title) {
                condition = condition && ele.title.includes(searchParams.title);
            }
            if (searchParams.timeExecutionTimeStamp) {
                condition =
                    condition &&
                    new Date(
                        searchParams.timeExecutionTimeStamp
                    ).toDateString() ===
                        new Date(ele.timeExecutionTimeStamp).toDateString();
            }
            return condition;
        });
        return filteredTasks.map((ele) =>
            buildTask({ ...ele, is: ele._id }).getTask()
        );
    }

    logger.info({ correlationId, msg: "Completed search tasks usecase" });
    return tasks.map((ele) => buildTask({ ...ele, is: ele._id }).getTask());
}
