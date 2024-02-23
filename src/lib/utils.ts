import { Context } from "koa";
import HTTPError from "./types/http-error";
import { JsonWebTokenError, sign, verify } from "jsonwebtoken";
import ModelNotFoundError from "./models/model-not-found-error";
import { format } from "date-fns-tz";
import { randomBytes, randomInt } from "node:crypto";

export const generateRandomHexString = (
	length: number,
): Promise<string> => {
	return new Promise((res, rej) => {
		randomBytes(length, (err, value) => {
			if (err) return rej(err);

			return res(value.toString('hex'));
		});
	});
};

export const generateRandomInt = (
	min: number,
	max: number
): Promise<number> => {
	return new Promise((res, rej) => {
		randomInt(min, max, (err, value) => {
			if (err) return rej(err);

			return res(value);
		});
	});
};



export const handleError = (err: Error, ctx: Context) => {
	if (err instanceof HTTPError) return err.toResponse(ctx);

	if (err instanceof ModelNotFoundError)
		return new HTTPError(err.message, 404).toResponse(ctx);

	if (err instanceof JsonWebTokenError) {
		if (err.message === "jwt expired")
			return new HTTPError("expired_jwt", 498).toResponse(ctx);
		return new HTTPError("bad_jwt", 400).toResponse(ctx);
	}
	if ((err as any).code === "23505")
		return HTTPError.DUPLICATE_RESOURCE.toResponse(ctx);
	if ((err as any).code === "auth/argument-error")
		return new HTTPError("firebase_bad_token", 400).toResponse(ctx);
	if ((err as any).code === "auth/id-token-expired")
		return new HTTPError("firebase_expired_token", 401).toResponse(ctx);
	if ((err as any).code === "auth/email-already-exists")
		return new HTTPError("firebase_email_already_exists", 401).toResponse(
			ctx
		);

	ctx.response.status = 500;
	return (ctx.body = {
		success: false,
		error: "server_error",
	});
};

export const verifyJWT = <Data>(token: string): Promise<Data> => {
	return new Promise((res, rej) => {
		verify(token, process.env.JWT_KEY!, (err: any, data: any) => {
			// broken types on jwt lib?

			if (err) return rej(err);
			return res(data as Data);
		});
	});
};

export const signJWT = (
	data: any,
	expiry?: string | number
): Promise<string> => {
	return new Promise((res, rej) => {
		sign(
			data,
			process.env.JWT_KEY!,
			{ expiresIn: expiry || "30d" },
			(err: any, token: any) => {
				// broken types on jwt lib?

				if (err) return rej(err);
				return res(token);
			}
		);
	});
};

export const dateForMySQL = (date?: string) => {
	const d = new Date(date || "01-01-1970");
	return format(d, "yyyy-MM-dd", { timeZone: "Europe/Rome" });
};
