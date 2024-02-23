import { CustomContext } from "./custom-request"

interface NotifyUserRequestBody {
    user_id: string,
    car_name: string
}

export type NotifyUserRequest = CustomContext<NotifyUserRequestBody>;