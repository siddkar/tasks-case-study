import UserSchema from "./schemas/user.schema";

export default function makeUserPoolDb() {
    /**
     * Insert an user in user pool db
     * @param {*} userDetails
     */
    async function insert(userDetails) {
        await new UserSchema.create(userDetails);
    }

    /**
     * Get userinfo for a user
     * @param {*} clientId
     * @param {*} email
     * @returns user
     */
    async function findById(clientId, email) {
        return await new UserSchema.findOne({ clientId, email });
    }

    /**
     * Selective update a user
     * @param {*} clientId
     * @param {*} email
     * @param {*} userDetails
     */
    async function update(clientId, email, updatedUserDetails) {
        await new UserSchema.updateOne(
            { clientId, email },
            { ...updatedUserDetails }
        );
    }

    /**
     * Find all users
     * @returns list of user
     */
    async function find() {
        return await new UserSchema.find();
    }

    return Object.freeze({
        insert,
        findById,
        update,
        find,
    });
}
