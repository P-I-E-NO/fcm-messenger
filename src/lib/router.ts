import Koa, { Context } from "koa";
import mount from "koa-mount";
import body from "koa-bodyparser";
import App from "./types/app";

import main from "./routes/main";

import State from "./types/state";
import { handleError } from "./utils";
import { Pool } from "pg";
import PgPool from "./postgre/PgPool";

const app = new Koa<State, App<Pool>>();

app.context["db"] = new PgPool(
	process.env.DB_CONNECTION_URI === "test"
		? "postgresql://root@pg:26257/test_db"
		: undefined
);

app.use(body());
app.use(async (ctx, next) => {
	try {
		await next();
		if (ctx.state.connection?.inTransaction()) {
			await ctx.state.connection.commit();
		}
	} catch (err) {
		// if(ctx.request.path === '/summary')
		console.log(err); // winston logging pls

		if (ctx.state.connection) {
			if (ctx.state.connection.inTransaction()) {
				await ctx.state.connection.rollback();
			}
			await ctx.state.connection.release();
		}
		return handleError(err as Error, ctx);
	}
});

app.use(mount("/", main.routes()));

export default app;
