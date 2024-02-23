import { Context, DefaultState, Request } from "koa";
import State from '../state';
import { ParsedUrlQuery } from "querystring";

interface CustomPostRequest<B> extends Request {
    body: B,
} 
interface CustomGetRequest<Q extends ParsedUrlQuery> extends Request {
    query: Q
}
export interface CustomContext<ReqB = any, ResB = any> extends Context {
    request: CustomPostRequest<ReqB>;
    body: ResB;
    state: DefaultState & State
}

export interface CustomGetContext<Q extends ParsedUrlQuery = any, ResB = any> extends Context {
    request: CustomGetRequest<Q>;
    body: ResB;
    state: DefaultState & State
}