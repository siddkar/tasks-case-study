/* Parses request and sends relevant data to the controller */
function makeExpressCallback(controller) {
    return async (req, res, next) => {
        try {
            const httpRequest = {
                body: req.body,
                query: req.query,
                params: req.params,
                ip: req.ip,
                method: req.method,
                path: req.path,
                cookies: req.cookies,
                signedCookies: req.signedCookies,
                headers: {
                    "Content-Type": req.get("Content-Type"),
                    Referer: req.get("referer"),
                    "User-Agent": req.get("User-Agent"),
                    correlationId: req.headers["x-correlation-id"],
                },
            };
            const httpResponse = await controller(httpRequest);
            res.set("x-correlation-id", req.headers["x-correlation-id"]);
            if (httpResponse.headers) {
                res.set(httpResponse.headers);
            }
            if (httpResponse.cookies && !httpResponse.clearCookiesIndicator) {
                Object.keys(httpResponse.cookies).forEach((key) => {
                    res.cookie(key, httpResponse.cookies[key], {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "prod",
                        signed: true,
                        maxAge: eval(process.env.SESSION_TOKEN_EXPIRY) * 1000,
                        sameSite: "none",
                    });
                });
            }
            if (httpResponse.clearCookiesIndicator) {
                httpResponse.clearCookieList.forEach((key) => {
                    res.clearCookie(key);
                });
            }
            return res.status(httpResponse.statusCode).json(httpResponse.body);
        } catch (e) {
            return next(e);
        }
    };
}

export default makeExpressCallback;
