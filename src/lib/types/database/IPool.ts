import IConnection from "./IConnection";

export default interface IPool<T>{
    getConnection(): Promise<IConnection>,
    testConnection(): Promise<void>,
    rawPool(): T,
    disconnect(): void
}