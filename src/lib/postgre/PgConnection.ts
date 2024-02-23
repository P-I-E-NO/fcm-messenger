import { PoolClient, QueryResultRow } from 'pg';
import IConnection from "../types/database/IConnection";

export default class PgConnection implements IConnection {

  private connection: PoolClient;
  private _in_transaction: boolean = false;
  private readonly _history = new Array<{ sql: string, opts: any[] | undefined }>();

  get history() {
    return this._history;
  }

  constructor(connection: PoolClient) {
    this.connection = connection;
  }
  inTransaction(): boolean {
    return this._in_transaction;
  }
  async query<T extends QueryResultRow>(sql: string, opts?: any[]){

    if(process.env.NODE_ENV !== 'production')
      this._history.push({ sql, opts });

    return await this.connection.query<T>(sql, opts);

  }
  async startTransaction(): Promise<void> {

    this._in_transaction = true;
    await this.query("begin");

  }
  async commit(): Promise<void> {

    this._in_transaction = false;
    await this.query("commit");

  }
  async rollback(): Promise<void> {

    await this.query("rollback");

  }
  async release(): Promise<void> {
    this.connection.release();
  }

}
