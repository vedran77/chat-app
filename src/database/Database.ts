import _ from "lodash";
import fs from "fs";

import { IStorageDriver } from "./IStorageDriver";
import { ConnectionDetailsType } from "./ConnectionDetailsType";
import { ORM } from "./ORM";

interface IDatabase {
    ready(): Promise<void>;
    disconnect(): void;
    select(query: string, params?: any[]): Promise<any[]>;
    update(query: string, params?: any[]): Promise<number>;
    insert(query: string, params?: any[]): Promise<any>;
    delete(query: string, params?: any[]): Promise<number>;
    query(query: string, params?: any[]): Promise<any>;
    orm: ORM;
}

class Database implements IDatabase {

    private static readonly LOGS_PATH: string = "./logs/database";

    private _ready: Promise<void>;

    protected _storageDriver: IStorageDriver;

    constructor(storageDriver: IStorageDriver, connectionDetails: ConnectionDetailsType) {
        this._storageDriver = storageDriver;

        const connectionStatus: boolean = this._storageDriver.connect(connectionDetails);

        if (connectionStatus) {
            this._ready = Promise.resolve();
        } else {
            this._ready = Promise.reject(this._storageDriver.getConnectionError().message);
        }
    }

    public async ready(): Promise<void> {
        return await this._ready;
    }

    /**
     * @description Prekida konekciju na bazu
     */
    public disconnect(): void {
        this._storageDriver.disconnect();
    }

    /**
     * @description Vraca selektovane stavke iz baze
     * @param {string} query
     * @param {any[]=} params
     * @returns {Promise<any[]>}
     */
    public async select(query: string, params?: any[]): Promise<any[]> {
        return await this._storageDriver.query(query, params);
    }

    /**
     * @description Vraca broj updatovanih redova u bazi
     * @param {string} query
     * @param {any[]=} params
     * @returns {Promise<number>}
     */
    public async update(query: string, params?: any[]): Promise<number> {
        const results: any = await this._storageDriver.query(query, params);

        return results.affectedRows;
    }

    /**
     * @description Vraca broj obrisanih redova iz baze
     * @param {string} query
     * @param {any[]=} params
     * @returns {Promise<number>}
     */
    public async delete(query: string, params?: any[]): Promise<number> {
        const results: any = await this._storageDriver.query(query, params);

        return results.affectedRows;
    }

    /**
     * @description Vraca id zadnjeg insertovanog reda u tablicu
     * @param {string} query
     * @param {any[]=} params
     * @returns {Promsise<any>}
     */
    public async insert(query: string, params?: any[]): Promise<any> {
        const results: any = await this._storageDriver.query(query, params);

        return results.insertId;
    }

    /**
     * @description Vraca raw query rezultat
     * @param {string} query
     * @param {any[]=} params
     * @returns {Promise<any>}
     */
    public async query(query: string, params?: any[]): Promise<any> {
        const results: any = await this._storageDriver.query(query, params);

        return results;
    }

    /**
     * @description Vraca instansu ORM-a (query builder)
     * @returns {ORM}
     */
    public get orm(): ORM {
        return new ORM(this);
    }

}

export { Database, IDatabase };