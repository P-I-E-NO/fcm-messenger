import Router from "@koa/router";
import State from "../types/state";
import { checkAuth } from "../middlewares/check-auth";
import { NotifyUserRequest } from "../types/dto/notify-user-request";
import { withConnection } from "../middlewares/with-connection";
import admin from "firebase-admin";
import { nanoid } from "nanoid";

const router = new Router<State>();

router.get("/", async (ctx) => {
  return (ctx.body = {
    success: true,
    message: "fcm-messenger",
  });
});

router.post(
  "/notify",
  checkAuth(),
  withConnection(true),
  async (ctx: NotifyUserRequest) => {
    const { connection, notification_claims } = ctx.state;
    const { fuel_value } = ctx.request.body;

    const user = await connection!.query<{ token: string }>(
      `select token from fcm_tokens where user_id = $1`,
      [notification_claims?.data.owner],
    );

    console.log(fuel_value);

    if (user.rowCount === 0) {
      console.log(`no token found for user ${notification_claims?.data.owner}`);

      return (ctx.body = {
        success: true,
        message: "no_token_found",
      }); // we fail "happily"
    }

    const tokens: Array<Promise<string>> = user.rows.map((t) =>
      admin.messaging().send({
        token: t["token"].toString(),
        notification: {
          title: `${notification_claims?.data.car_name} è in riserva!`,
          body: "Clicca per visualizzare il distributore migliore",
        },
        data: {
          car_name: notification_claims!.data.car_name,
          owner: notification_claims!.data.owner,
          tank_size: notification_claims!.data.tank_size.toString(),
          consumption: notification_claims!.data.consumption.toString(),
          fuel_value
        },
      }),
    );

    await Promise.all(tokens.map((p) => p.catch((_) => null))); // silent fail

    const notification_id = nanoid(32);
    await connection!.query(
      `
				insert into notifications (id, to_user, data) values ($1, $2, $3)
		`,
      [
        notification_id,
        notification_claims!.data.owner,
        {
          car_name: notification_claims!.data.car_name,
          owner: notification_claims!.data.owner,
          tank_size: notification_claims!.data.tank_size.toString(),
          consumption: notification_claims!.data.consumption.toString(),
          fuel_value: fuel_value
        },
      ],
    );

    console.log(`sent ${tokens.length} notifications`);

    return (ctx.body = {
      success: true,
    });
  },
);

export default router;
