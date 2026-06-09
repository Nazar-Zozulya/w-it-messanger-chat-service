import { Request, Response, NextFunction } from "express"

export function isDataMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (req.method === "GET" || req.method === "DELETE") {
		return next()
	}

	try {
        if (!req.body) {
            return res.json({status: 'error', message: 'client give no data'})
        }

        return next()
	} catch (error) {
		return res.json({ status: "error", message: "some problems during checking data" })
	}
}
