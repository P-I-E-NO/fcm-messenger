import { CustomContext } from "./custom-request"

interface NotifyUserRequestBody {
    fuel_value: string
}

export type NotifyUserRequest = CustomContext<NotifyUserRequestBody>;