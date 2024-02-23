import { Context, Next } from "koa";
import HTTPError from "../types/http-error";
import admin from "firebase-admin";
import { decode } from "jsonwebtoken";
import { verifyJWT } from "../utils";
import { NotificationClaims } from "../types/dto/notification-claims";

export interface AuthParams {
	uid: string;
}

export const checkAuth = () => {
	return async (ctx: Context, next: Next) => {
		const auth_header = ctx.headers.authorization;
		if (!auth_header) throw HTTPError.FORBIDDEN;
		const auth_header_split = auth_header.split("Bearer ");
		if (auth_header_split.length < 2) throw HTTPError.MALFORMED_CREDENTIALS;

		const token = auth_header_split[1];
		
		const claims = await verifyJWT<NotificationClaims>(token);
		ctx.state["notification_claims"] = claims;

		return next();
	};
};
