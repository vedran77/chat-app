import _ from "lodash";
import { IDatabase } from "./Database";

type RowAndValue = {
    row: string;
    value: any;
};

type WhereOperator = "OR" | "AND";

class ORM {

    private _table: string;
    private _updates: RowAndValue | RowAndValue[];
    private _select: string | string[];
    private _inserts: any[];
    private _where: RowAndValue | RowAndValue[];
    private _whereOperator: WhereOperator;
    private _limit?: number = 1;
    private _deletes: boolean = false;
    private _db: IDatabase;
    private _splitShards: number = 0;

    constructor(db: IDatabase) {
        this._db = db;
    }

    public table(name: string): ORM {
        this._table = name;
        return this;
    }

    public updates(rowAndValue: RowAndValue | RowAndValue[]): ORM {
        this._updates = rowAndValue;
        return this;
    }

    public select(rows: string | string[]): ORM {
        this._select = rows;
        return this;
    }

    public inserts<T = any>(rows: T[]): ORM {
        this._inserts = rows;
        return this;
    }

    public deletes(): ORM {
        this._deletes = true;
        return this;
    }

    public where(rowAndValue: RowAndValue | RowAndValue[], operator: WhereOperator = "AND"): ORM {
        this._where = rowAndValue;
        this._whereOperator = operator;
        return this;
    }

    public limit(limit: number): ORM {
        this._limit = limit;
        return this;
    }

    public noLimit(): ORM {
        this._limit = undefined;
        return this;
    }

    public splitShards(value: number): ORM {
        this._splitShards = value;
        return this;
    }

    public async execute<T = any>(): Promise<T> {

        const whereArr: RowAndValue[] = this._where === undefined ? undefined : _.isArray(this._where) ? this._where : [this._where];
        let result: T;

        if (this._updates !== undefined) {
            result = await this._executeUpdate(whereArr) as any;
        } else if (this._select !== undefined) {
            result = await this._executeSelect(whereArr) as any;
        } else if (this._inserts !== undefined) {
            result = await this._executeInsert<T>() as any;
        } else if (this._deletes) {
            result = await this._executeDeletes(whereArr) as any;
        }

        this._dispose();

        return result;
    }

    private async _executeDeletes(whereArr: RowAndValue[]): Promise<number> {

        // Failsafe u slucaju da se zeli izvrsiti delete bez `where` statementa
        if (whereArr === undefined) {
            return 0;
        }

        const where: string = _.join(_.map(whereArr, (rowAndValue: RowAndValue) => `${rowAndValue.row}=?`), ` ${this._whereOperator} `);
        const limitStr: string = this._limit === undefined ? "" : ` LIMIT ${this._limit}`;

        return this._db.delete(
            `DELETE FROM ${this._table} WHERE ${where}${limitStr}`,
            _.map(whereArr, (rowAndValue: RowAndValue) => rowAndValue.value),
        );
    }

    private async _executeInsert<T = any>(): Promise<number> {

        // Prvo moramo izmapat sva polja koja cemo insertat
        const fields: string[] = _.keys(_.first(this._inserts));
        const insertValues: any[] = [];

        // Onda buildamo jedan red upitnika (za jedan insert)
        const tmpFields: string[] = Array(fields.length);
        _.fill(tmpFields, "?");
        const valuePlaceholders: string = `(${_.join(tmpFields, ",")})`;

        _.forEach(this._inserts, (_insert: T) => {
            _.forEach(_insert as any, (value: any) => {
                insertValues.push(value);
            });
        });

        // Sad treba od jednog reda upitnika napraviti red za svaki insert
        const questionMarkShards: string[] = Array(this._inserts.length);
        _.fill(questionMarkShards, valuePlaceholders);

        return this._db.insert(`INSERT INTO ${this._table} (${_.join(fields, ",")}) VALUES ${_.join(questionMarkShards, ",")}`, insertValues);
    }

    private async _executeSelect(whereArr: RowAndValue[]): Promise<any[]> {
        
        let where: string = "";
        if (whereArr !== undefined) {
            const whereFields: string = _.join(_.map(whereArr, (rowAndValue: RowAndValue) => `${rowAndValue.row}=?`), ` ${this._whereOperator} `);
            where = `WHERE ${whereFields}`;
        }
        const filteredRows: string[] = _.filter(this._select, (select: string) => {
            return select.match(/[^a-zA-Z0-9_]+/g) === null;
        });
        const limitStr: string = this._limit === undefined ? "" : ` LIMIT ${this._limit}`;
        const whereValues: any[] = _.map(whereArr, (rowAndValue: RowAndValue) => rowAndValue.value);

        return this._db.select(`SELECT ${_.join(filteredRows, ",")} FROM ${this._table} ${where}${limitStr}`, [
            ...whereValues,
        ]);
    }

    private async _executeUpdate(whereArr: RowAndValue[]): Promise<number> {

        // Failsafe u slucaju da se zeli izvrsiti update bez `where` statementa
        if (whereArr === undefined) {
            return 0;
        }

        const updatesArr: RowAndValue[] = _.isArray(this._updates) ? this._updates : [this._updates];
        const limitStr: string = this._limit === undefined ? "" : ` LIMIT ${this._limit}`;
        if (this._splitShards === 0 || this._splitShards === 1) {
            const updates: string = _.join(_.map(updatesArr, (rowAndValue: RowAndValue) => `${rowAndValue.row}=?`), ",");
            const where: string = _.join(_.map(whereArr, (rowAndValue: RowAndValue) => `${rowAndValue.row}=?`), ` ${this._whereOperator} `);

            const updateValues: any[] = _.map(updatesArr, (rowAndValue: RowAndValue) => rowAndValue.value);
            const whereValues: any[] = _.map(whereArr, (rowAndValue: RowAndValue) => rowAndValue.value);


            return this._db.update(`UPDATE ${this._table} SET ${updates} WHERE ${where}${limitStr}`, [
                ...updateValues,
                ...whereValues,
            ]);
        } else {
            // Ukoliko je setano da splitamo query u vise shardova
            const shardedUpdatesArr: any[][] = [];

            let counter: number = 0;
            let currentShard: number = 0;
            for (let i = 0; i < updatesArr.length; i ++) {
                if (counter < this._splitShards) {
                    counter ++;
                } else {
                    currentShard ++;
                    counter = 0;
                }
                shardedUpdatesArr[currentShard].push(updatesArr[i]);
            }

            const where: string = _.join(_.map(whereArr, (rowAndValue: RowAndValue) => `${rowAndValue.row}=?`), ` ${this._whereOperator} `);
            const whereValues: any[] = _.map(whereArr, (rowAndValue: RowAndValue) => rowAndValue.value);

            let rowsUpdates: number;
            for (const updateShardArr of shardedUpdatesArr) {
                const updates: string = _.join(_.map(updateShardArr, (rowAndValue: RowAndValue) => `${rowAndValue.row}=?`), ",");
                const updateValues: any[] = _.map(updateShardArr, (rowAndValue: RowAndValue) => rowAndValue.value);

                rowsUpdates = await this._db.update(`UPDATE ${this._table} SET ${updates} WHERE ${where}${limitStr}`, [
                    ...updateValues,
                    ...whereValues,
                ]);
            }
            return rowsUpdates;
        }
    }

    private _dispose(): void {
        this._db = undefined;
        this._limit = undefined;
        this._select = undefined;
        this._splitShards = undefined;
        this._table = undefined;
        this._updates = undefined;
        this._where = undefined;
        this._inserts = undefined;
    }
}

export { ORM, RowAndValue };
