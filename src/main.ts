import app from "./lib/router";
import admin from "firebase-admin";

if (!process.env.SERVICE_ACCOUNT_PATH)
	throw new Error("no google credentials set");

if (!process.env.DB_CONNECTION_STRING)
	throw new Error("no db uri set");

admin.initializeApp({
	credential: admin.credential.cert(
		require(process.env.SERVICE_ACCOUNT_PATH!)
	),
});

app.listen(5050, () => {
	console.log(`app-backend is online on port 5050`);
});
