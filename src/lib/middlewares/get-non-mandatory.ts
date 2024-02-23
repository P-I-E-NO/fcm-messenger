import { Context, Next } from "koa";
import HTTPError from "../types/http-error";
import Parameter from "../types/get-parameter";
import { encode } from "html-entities";
import { CustomGetContext } from "../types/dto/custom-request";

export const getNonMandatory = (...params: (string | Parameter)[]) => {
	return async (ctx: Context, next: Next) => {
		const invalid = new Array();
		const body: { [key: string]: any } = ctx.request.query!;

		console.log(body);
		params.forEach((parameter) => {
			if (Object.prototype.hasOwnProperty.call(parameter, "name")) {
				const cast = parameter as Parameter;

				if (Object.hasOwn(body, cast.name)) {
					if (cast.escape) {
						body[cast.name] = encode(
							body[cast.name] as string
						).trim();
					}

					if (cast.validator) {
						if (cast.validator(ctx as CustomGetContext) === false) {
							invalid.push({
								name: cast.name,
								missing_name: cast.missing_name,
							});
						}
					}
				}
			}
		});

		const error = new HTTPError("bad_request", 400);

		if (invalid.length > 0) {
			error.addParam("invalid_parameters", invalid);
			throw error;
		}

		return next();
	};
};
