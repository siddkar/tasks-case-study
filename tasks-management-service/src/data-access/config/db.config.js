import mongoose from "mongoose";

export default function connectDb() {
    const {
        DB_USER_ID: username,
        DB_PASSWORD: password,
        DB_HOST: dbHost,
        DB_PORT: dbPort,
        DB_NAME: dbName,
    } = process.env;

    const connectionString = `mongodb://${dbHost}:${dbPort}/${dbName}`;

    mongoose
        .connect(connectionString, {
            auth: {
                username,
                password,
            },
        })
        .then(() => {
            console.log("MongoDB connection established successfully!!!");
        })
        .catch((err) => {
            console.error("Unable to connect to MongoDB :: ", err);
        });
}
