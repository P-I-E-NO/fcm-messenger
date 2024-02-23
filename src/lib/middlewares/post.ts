import { Context, Next } from 'koa';
import HTTPError from '../types/http-error';
import Parameter from '../types/post-parameter'
import { encode } from 'html-entities';
import { CustomContext } from '../types/dto/custom-request';

export const post = <T>(...params: (string | Parameter)[]) => {

    return async (ctx: Context, next: Next) => {

        const missing = new Array();
        const invalid = new Array();
        const body: { [key: string]: any } = ctx.request.body!;

        params
            .forEach(parameter => {

                if (Object.prototype.hasOwnProperty.call(parameter, "name")) {

                    const cast = parameter as Parameter;

                    if (
                        body[cast.name!] === undefined ||
                        body[cast.name!] === null
                    ) {
                        if (Object.prototype.hasOwnProperty.call(cast, "missing_name")) {
                            missing.push({
                                name: cast.name,
                                missing_name: cast.missing_name
                            })
                        } else missing.push(cast.name);

                        return;
                    }

                    if (cast.escape) {
                        body[cast.name] = encode(
                            body[cast.name].toString()
                        ).trim();
                    }

                    if (cast.validator) {
                        if (!cast.validator(ctx as CustomContext)) {
                            invalid.push({
                                name: cast.name,
                                missing_name: cast.missing_name
                            })
                        }
                    }

                } else {

                    if (
                        body[parameter as string] === undefined ||
                        body[parameter as string] === null
                    ) missing.push(parameter);

                }

            })

        const error = new HTTPError('bad_request', 400);
        if (missing.length > 0)
            error.addParam('missing_parameters', missing);
        if (invalid.length > 0)
            error.addParam('invalid_parameters', invalid);

        if (missing.length || invalid.length)
            throw error;

        return next();

    }

}