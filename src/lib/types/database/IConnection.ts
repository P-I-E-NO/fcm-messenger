import { QueryResult, QueryResultRow } from "pg"

export default interface IConnection {
    query<T extends QueryResultRow>(sql: string, opts?: Array<any>): Promise<QueryResult<T>>,
    inTransaction(): boolean,
    release(): void,
    startTransaction(): void,
    commit(): void,
    rollback(): void
}