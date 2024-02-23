import { CustomContext } from "./dto/custom-request";

export default interface PostParameter{
    name: string,
    escape?: boolean,
    missing_name?: string,
    validator?: (ctx: CustomContext) => Promise<boolean> | boolean
}

