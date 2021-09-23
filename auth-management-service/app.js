import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import pino from "pino";
import cookieParser from "cookie-parser";
import httpErrorHandlerMiddleware from "./src/shared/utils/http.error.handler.middleware";
//import authRouter from "./src/routes/auth-routes/auth.routes";
import correlationIdMiddleware from "./src/shared/utils/correlation.id.middleware";
import connectDb from "./src/data-access/config/db.config";

dotenv.config();

connectDb();

const logger = pino();
const contextPath = process.env.CONTEXT_PATH;

const app = express();
app.use(cors());
app.use(correlationIdMiddleware());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//app.use(`${contextPath}`, authRouter);

app.use(httpErrorHandlerMiddleware());

app.listen(5000, () => {
    logger.info(`Listening on 5000: http://localhost:5000${contextPath}`);
});
