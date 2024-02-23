import { CustomGetContext } from "./dto/custom-request";

export default interface PostParameter{
    name: string,
    escape?: boolean,
    missing_name?: string,
    validator?: (ctx: CustomGetContext) => Promise<boolean> | boolean
}

