import { NextApiRequest, NextApiResponse } from 'next';
import { CookieSerializeOptions, serialize } from 'cookie';
import NextCors from "nextjs-cors";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await NextCors(req, res, {
      // Options
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: process.env.NODE_ENV !== "production" ? '*' : ['https://www.qaryb.com', 'https://qaryb.com', 'https://dev.qaryb.com'],
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   });

	const options: CookieSerializeOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development',
		path: '/',
		expires: new Date(Date.now()),
		maxAge: 0,
		sameSite: 'lax',
		// domain: `${process.env.NEXT_BACKEND_DOMAIN}`,
	};

	if (req.method === 'POST' && req.body.tokens) {
		res.setHeader("Set-Cookie", [
      serialize("@tokenType", "false", {
        ...options
      }),
			serialize("@initStateToken", "false", {
        ...options
      }),
			serialize("@initStateUniqueID", "false", {
        ...options
      }),
    ]);
		res.status(204);
		res.end();
	}
}
