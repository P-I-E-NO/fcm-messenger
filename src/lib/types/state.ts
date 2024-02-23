import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import IConnection from "./database/IConnection";
import { NotificationClaims } from "./dto/notification-claims";

export default interface State {
    connection?: IConnection,
    notification_claims?: NotificationClaims
}