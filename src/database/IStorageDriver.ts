import { ConnectionDetailsType } from "./ConnectionDetailsType";

interface IStorageDriver {
    connect(details: ConnectionDetailsType): any;
    disconnect(): void;
    getConnection(): any;
    query(query: string, params: any[]): Promise<any>;
    getConnectionError(): Error;
}

export { IStorageDriver };
