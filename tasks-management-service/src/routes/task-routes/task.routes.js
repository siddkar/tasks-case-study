import express from "express";
import makeExpressCallback from "../../shared/utils/express.callback";
import tokenVerificationMiddleware from "../../shared/utils/token.verification.middleware";
import postTask from "../../controllers/task-controllers/post.task.controller";
import getTaskById from "../../controllers/task-controllers/get.task.by.id.controller";
import getTasks from "../../controllers/task-controllers/get.task.controller";
import patchTask from "../../controllers/task-controllers/patch.task.controller";
import deleteTask from "../../controllers/task-controllers/delete.task.controller";
import { SCOPE } from "../../shared/constants";

const taskRouter = express.Router();

taskRouter.post(
    "/",
    tokenVerificationMiddleware([SCOPE.READ_WRITE]),
    makeExpressCallback(postTask)
);

taskRouter.get(
    "/:parcelId",
    tokenVerificationMiddleware([SCOPE.READ_WRITE, SCOPE.READ]),
    makeExpressCallback(getTaskById)
);

taskRouter.get(
    "/",
    tokenVerificationMiddleware([SCOPE.READ, SCOPE.READ_WRITE]),
    makeExpressCallback(getTasks)
);

taskRouter.patch(
    "/:parcelId",
    tokenVerificationMiddleware([SCOPE.READ_WRITE]),
    makeExpressCallback(patchTask)
);

taskRouter.delete(
    "/:parcelId",
    tokenVerificationMiddleware([SCOPE.READ_WRITE]),
    makeExpressCallback(deleteTask)
);

export default taskRouter;
