import express from "express";
import authenticate from "../../controllers/auth-controllers/authenticate.controller";
import refreshSession from "../../controllers/auth-controllers/refresh.session.controller";
import verifyToken from "../../controllers/auth-controllers/verify.token.controller";
import register from "../../controllers/auth-controllers/register.controller";
import logout from "../../controllers/auth-controllers/logout.controller";
import makeExpressCallback from "../../shared/utils/express.callback";
import authMiddleware from "../../shared/utils/auth.middleware";

const authRouter = express.Router();

authRouter.post("/register", makeExpressCallback(register));

authRouter.post("/authenticate", makeExpressCallback(authenticate));

authRouter.post("/refresh-session", makeExpressCallback(refreshSession));

authRouter.post(
    "/verify-token",
    authMiddleware(),
    makeExpressCallback(verifyToken)
);

authRouter.post("/logout", makeExpressCallback(logout));

export default authRouter;
