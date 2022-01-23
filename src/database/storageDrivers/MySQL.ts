import mysql from "mysql2";

import { ConnectionDetailsType } from "../ConnectionDetailsType";
import { IStorageDriver } from "../IStorageDriver";
import { Config } from "../../Config";

class MySQL implements IStorageDriver {

    private static readonly DEFAULT_POOL_SIZE: number = 6;

    protected _connection: mysql.Pool;
    protected _connectionError: Error;

    /**
     * Inicijalizacija konekcije na MySQL
     * @param {ConnectionDetailsType} details Podaci konekcije
     */
    public connect(details: ConnectionDetailsType): any {

        const poolSize: number = Config.get("database.mysql.poolSize") || MySQL.DEFAULT_POOL_SIZE;
        const options: mysql.PoolOptions = {
            connectionLimit: poolSize,
            host: details.host,
            user: details.username,
            password: details.password,
            database: details.database,
            connectTimeout: details.connectionTimeout || 10000,
        };

        try {
            this._connection = mysql.createPool(options);
            return true;
		} catch (error) {
            this._connectionError = error;
			return false;
		}
    }

    /**
     * Unistava konekciju, diskonektuje se sa servera
     */
    public disconnect(): void {
        this._connection.end();
    }

    /**
     * Sirova upit funkcija koju koristi `Database` wrapper
     * @param {string} query Upit
     * @param {any[]} params Lista query parametara 
     */
    public async query(query: string, params?: any[]): Promise<any> {
        return new Promise((resolve: Function, reject: Function) => {
            this._connection.execute(query, params, (err: any, results: any, fields) => {
                err ? reject(err) : resolve(results);
            });
        });
    }

    /**
     * Vraca raw konekciju drivera
     */
    public getConnection(): any {
        return this._connection;
    }

    /**
     * Vraca error koji je nastao na konekciji (ukoliko je nastao)
     */
    public getConnectionError(): Error {
        return this._connectionError;
    }
}

export { MySQL };
