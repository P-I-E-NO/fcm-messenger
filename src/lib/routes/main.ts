import Router from "@koa/router";
import State from "../types/state";
import { checkAuth } from "../middlewares/check-auth";
import { post } from "../middlewares/post";
import { NotifyUserRequest } from "../types/dto/notify-user-request";
import { withConnection } from "../middlewares/with-connection";
import admin from "firebase-admin";

const router = new Router<State>();

router.get("/", async (ctx) => {
	return ctx.body = {
		success: true,
		message: "fcm-messenger",
	};
});

router.post(
	'/notify',
	checkAuth(),
	withConnection(),
	async (ctx: NotifyUserRequest) => {

		const {
			connection,
			notification_claims
		} = ctx.state;

		const user = await connection!.query<{ token: string }>(
			`select token from fcm_tokens where user_id = $1`,
			[ notification_claims?.data.owner ]
		)

		if(user.rowCount === 0){
			return ctx.body = {
				success: true,
				message: "no_token_found"
			} // we fail "happily"
		}

		const tokens = user.rows.map(t => 
			admin.messaging().send(
				{
					token: t['token'].toString(),
					data: {
						car_name: notification_claims!.data.car_name,
						owner: notification_claims!.data.owner,
						tank_size: notification_claims!.data.tank_size.toString(),
						consumption: notification_claims!.data.consumption.toString(),
					}
				},
			)
		);

		await Promise.all(tokens);

		return ctx.body = {
			success: true,
		}

	}
)

export default router;
