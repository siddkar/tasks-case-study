import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pino from "pino";
import correlationIdMiddleware from "./src/shared/utils/correlation.id.middleware";
import httpErrorHandlerMiddleware from "./src/shared/utils/http.error.handler.middleware";

dotenv.config();

const logger = pino();

const contextPath = process.env.CONTEXT_PATH;

const app = express();
app.use(cors());
app.use(correlationIdMiddleware());
app.use(express.json());

//app.use(`${contextPath}/tasks`, tasksRouter);

app.use(httpErrorHandlerMiddleware());

app.listen(8000, () => {
    logger.info(`Listening on 8000: http://localhost:8000${contextPath}`);
});
