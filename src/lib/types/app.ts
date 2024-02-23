import IPool from "./database/IPool";

export default interface App<T> {
    db: IPool<T>,
}