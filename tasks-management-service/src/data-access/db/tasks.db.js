import TaskSchema from "./schemas/task.schema";

export default function makeUserPoolDb() {
    /**
     * Insert a task
     * @param {*} taskDetails
     */
    async function insert(taskDetails) {
        return await TaskSchema.create(taskDetails);
    }

    /**
     * Get task by id
     * @param {*} id
     * @returns task
     */
    async function findById(id) {
        return await TaskSchema.findOne({ _id: id });
    }

    /**
     * Selective update a task
     * @param {*} id
     * @param {*} updatedTaskDetails
     */
    async function update(id, updatedTaskDetails) {
        await TaskSchema.updateOne({ _id: id }, { ...updatedTaskDetails });
    }

    /**
     * Find all taks
     * @returns list of task
     */
    async function find() {
        return await TaskSchema.find({}).exec();
    }

    /**
     * Delete a task
     * @param {*} id
     */
    async function deleteById(id) {
        return await TaskSchema.deleteOne({ _id: id });
    }

    return Object.freeze({
        insert,
        findById,
        update,
        find,
        deleteById,
    });
}
