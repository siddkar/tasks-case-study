import makeUserPoolDb from "./user.pool.db";
import connectDb from "../config/db.config";

export const userPoolDb = makeUserPoolDb({ connectDb });
export default {
    userPoolDb,
};
