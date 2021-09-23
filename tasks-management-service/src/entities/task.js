import pino from "pino";
import { ERROR_TYPE } from "../shared/constants";

/**
 * Build an task entity
 * @returns task entity
 */
export default function buildTask(
    correlationId,
    {
        id,
        title,
        description,
        taskExecutionTimestamp,
        taskReminderTimestamp,
        isCompleted = false,
    }
) {
    const logger = pino({
        name: "title.entity",
    });
    const errorList = [];
    if (!title) {
        errorList.push({
            fieldName: "title",
            message: "Title should be valid",
        });
    }
    if (!description) {
        errorList.push({
            fieldName: "description",
            message: "Description should be valid",
        });
    }
    if (!taskExecutionTimestamp) {
        errorList.push({
            fieldName: "taskExecutionTimestamp",
            message: "Task execution timestamp should be valid",
        });
    }
    if (!taskReminderTimestamp) {
        errorList.push({
            fieldName: "taskReminderTimestamp",
            message: "Task reminder timestamp should be valid",
        });
    }

    if (errorList.length) {
        logger.error({ correlationId, errorList, msg: "Bad Request" });
        throw { type: ERROR_TYPE.BAD_DATA, errorList, correlationId };
    }

    return Object.freeze({
        getTask: () => ({
            id,
            title,
            description,
            taskExecutionTimestamp,
            taskReminderTimestamp,
            isCompleted,
        }),
    });
}
