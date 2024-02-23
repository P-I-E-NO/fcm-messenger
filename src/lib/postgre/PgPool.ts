import IPool from '../types/database/IPool';
import RoachConnection from './PgConnection';
import MySQLConnection from './PgConnection';
import { Pool } from 'pg';

export default class PgPool implements IPool<Pool>{
    
    private pool: Pool;

    constructor(conn_string?: string){
        
        this.pool = new Pool({
            connectionString: conn_string || process.env.DB_CONNECTION_STRING
        })
    }

    async disconnect(): Promise<void> {

        await this.pool.end();

    }

    async testConnection(): Promise<void> {
        
        const conn = await this.getConnection();
        await conn.release();

    }
    rawPool(): Pool{
        return this.pool;
    }
    async getConnection(): Promise<MySQLConnection> {

        return new RoachConnection(await this.pool.connect());

    }
}