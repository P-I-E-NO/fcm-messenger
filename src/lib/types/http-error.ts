import { Context } from "koa";

export default class HTTPError extends Error {
	#error_message: string;
	#error_code: number;
	#response: {
		success: boolean;
		[value: string]: any;
	};

	constructor(error_message: string, error_code: number) {
		super(error_message);

		this.#error_message = error_message;
		this.#error_code = error_code;
		this.#response = {
			success: false,
			error: this.#error_message,
			status: this.#error_code,
		};
	}

	get response() {
		return this.#response;
	}

	// errors
	public static readonly INVALID_DATE_FORMAT = new HTTPError(
		"invalid_date_format",
		400
	);
	public static readonly INVALID_PROVIDER = new HTTPError(
		"invalid_provider",
		403
	);
	public static readonly SET_NOT_AVAILABLE = new HTTPError(
		"not_all_workers_are_available",
		409
	);
	public static readonly USER_EXISTS: HTTPError = new HTTPError(
		"user_exists",
		409
	);
	public static readonly FORBIDDEN: HTTPError = new HTTPError(
		"forbidden",
		403
	);
	public static readonly NOT_FOUND: HTTPError = new HTTPError(
		"not_found",
		404
	);
	public static readonly INVALID_CREDENTIALS = new HTTPError(
		"invalid_credentials",
		401
	);
	public static readonly EXPIRED_CREDENTIALS = new HTTPError(
		"expired_credentials",
		401
	);
	public static readonly MALFORMED_CREDENTIALS = new HTTPError(
		"malformed_credentials",
		400
	);
	public static readonly MALFORMED_REQUEST = new HTTPError(
		"malformed_request",
		400
	);
	public static readonly GENERIC_ERROR = new HTTPError("generic_error", 500);
	public static readonly USER_NOT_FOUND = new HTTPError(
		"user_not_found",
		404
	);
	public static readonly UNAUTHORIZED = new HTTPError("unauthorized", 403);
	public static readonly NO_PHOTOS_WHILE_PENDING = new HTTPError(
		"no_actions_on_photos_while_pending",
		409
	);
	public static readonly USER_INFO_ACCESS_UNAUTHORIZED = new HTTPError(
		"user_info_access_unauthorized",
		401
	);
	public static readonly CANNOT_GO_PENDING = new HTTPError(
		"cannot_go_pending",
		409
	);
	public static readonly MAX_SIZE_REACHED = new HTTPError(
		"max_storage_size_reached",
		400
	);
	public static readonly TOO_MANY_FILES = new HTTPError(
		"too_many_files",
		413
	);
	public static readonly TOO_MANY_REQUESTS = new HTTPError(
		"too_many_requests",
		429
	);
	public static readonly INVALID_MIMETYPE = new HTTPError(
		"invalid_mimetype",
		400
	);
	public static readonly BAD_REQUEST = new HTTPError("bad_request", 400);
	public static readonly VENUE_NOT_FOUND = new HTTPError(
		"venue_not_found",
		404
	);
	public static readonly REEL_NOT_FOUND = new HTTPError(
		"reel_not_found",
		404
	);
	public static readonly EVENT_NOT_FOUND = new HTTPError(
		"event_not_found",
		404
	);
	public static readonly AWS_KEY_NOT_FOUND = new HTTPError(
		"aws_key_not_found",
		404
	);
	public static readonly AWS_ACCESS_DENIED = new HTTPError(
		"aws_access_denied",
		403
	);
	public static readonly AWS_GENERIC_ERROR = new HTTPError(
		"aws_generic_error",
		500
	);
	public static readonly DUPLICATE_RESOURCE = new HTTPError(
		"duplicate_resource",
		409
	);

	public static readonly missingParameters = (...params: string[]) =>
		new HTTPError("missing_parameters", 400).addParam("missing", params);

	public toResponse(ctx: Context): void {
		ctx.status = this.#error_code;
		ctx.body = this.#response;
	}

	public addParam(key: string, value: any): this {
		this.#response[key] = value;
		return this;
	}

	public getStatus() {
		return this.#error_code;
	}

	/*public addObject(key: string, obj: any){
        this.#response[key] = obj;
    }

    public addParams(params: {
        [param_name: string]: any
    }[]): this{
        
        Object.keys(params)
            .forEach(key => {

                this.#response[key] = params[key as any];

            })
        return this;

    }*/
}
