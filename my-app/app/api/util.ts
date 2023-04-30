import { promises as fs } from 'fs';
import { ISort, ICondition, Operator, SortDirection, IQueryResult, IQuery, IEntity } from '../classes';
const sqlite3 = require('sqlite3').verbose();

class DBJSONProvider implements IDBProvider {
    dbFile: string;

    constructor(dbFile: string) {
        this.dbFile = dbFile;
    }
    _db = null;

    dbConnect = async () => {
        if (this._db)
            return this._db;

        const result = await fs.readFile(this.dbFile, 'utf-8');
        const db = JSON.parse(result);
        this._db = db;
        return db;
    }

    clearCache = () => {
        this._db = null;
    }

    dbCount = async (table: string, where: ICondition[] = []) => {
        const db = await this.dbConnect();
        return (db[table] as any[]).filter((x, i) => {
            for (const cond of where) {
                const value = x[cond.column];

                switch (cond.operator) {
                    case Operator.Equals:
                        if (value !== cond.value)
                            return false;
                        break;
                    case Operator.Contains:
                        if ((value as string).indexOf(cond.value as string) === -1)
                            return false;
                        break;
                    case Operator.StartsWith:
                        if (!(value as string).startsWith(cond.value as string))
                            return false;
                        break;
                    case Operator.EndsWith:
                        if (!(value as string).endsWith(cond.value as string))
                            return false;
                        break;
                    case Operator.NotEquals:
                        if (value === cond.value)
                            return false;
                        break;
                    case Operator.GreaterThan:
                        if (!(value > cond.value))
                            return false;
                        break;
                    case Operator.LessThan:
                        if (!(value < cond.value))
                            return false;
                        break;
                    case Operator.IsIn:
                        if ((cond.value as unknown as any[]).indexOf(value) === -1)
                            return false;
                        break;
                    case Operator.IsNotIn:
                        if ((cond.value as unknown as any[]).indexOf(value) !== -1)
                            return false;
                        break;
                    case Operator.IsNull:
                        if (value !== null)
                            return false;
                        break;
                    case Operator.IsNotNull:
                        if (value === null)
                            return false;
                        break;
                }
            }
            return true;
        }).length;
    }

    dbSelect = async (table: string, where: ICondition[] = [], sort: ISort[] = []) => {
        const db = await this.dbConnect();

        const results = (db[table] as any[]).filter((x, i) => {
            for (const cond of where) {
                const value = x[cond.column];

                switch (cond.operator) {
                    case Operator.Equals:
                        if (value !== cond.value)
                            return false;
                        break;
                    case Operator.Contains:
                        if ((value as string).indexOf(cond.value as string) === -1)
                            return false;
                        break;
                    case Operator.StartsWith:
                        if (!(value as string).startsWith(cond.value as string))
                            return false;
                        break;
                    case Operator.EndsWith:
                        if (!(value as string).endsWith(cond.value as string))
                            return false;
                        break;
                    case Operator.NotEquals:
                        if (value === cond.value)
                            return false;
                        break;
                    case Operator.GreaterThan:
                        if (!(value > cond.value))
                            return false;
                        break;
                    case Operator.LessThan:
                        if (!(value < cond.value))
                            return false;
                        break;
                    case Operator.IsIn:
                        if ((cond.value as unknown as any[]).indexOf(value) === -1)
                            return false;
                        break;
                    case Operator.IsNotIn:
                        if ((cond.value as unknown as any[]).indexOf(value) !== -1)
                            return false;
                        break;
                    case Operator.IsNull:
                        if (value !== null)
                            return false;
                        break;
                    case Operator.IsNotNull:
                        if (value === null)
                            return false;
                        break;
                }
            }
            return true;
        });

        console.log('RESULTS:');
        console.dir(results);

        if (sort.length > 0) {
            results.sort((a, b) => {
                for (const s of sort) {
                    const av = a[s.column];
                    const bv = b[s.column];
                    if (av < bv)
                        return s.direction == SortDirection.Asc ? -1 : 1;
                    if (av > bv)
                        return s.direction == SortDirection.Asc ? 1 : -1;
                }

                return 0;
            });
        }

        return { result: results, count: results.length, total: results.length } as IQueryResult<IQuery, IEntity>;
    }

    dbInsert = async (table: string, record: IEntity) => {
        const db = await this.dbConnect();
        db[table].push(record);
        return record;
    }

    dbDelete = async (table: string, id: string) => {
        const db = await this.dbConnect();
        const index = db[table].findIndex(x => x.id == id);
        if (index > -1) {
            (db[table] as []).splice(index, 1);
            return true;
        }
        return false;
    }

    dbUpdate = async (table: string, record: IEntity) => {
        const db = await this.dbConnect();
        const index = db[table].findIndex(x => x.id == record.id);
        if (index > -1) {
            db[table][index] = record;
        }
        return record;

    }

    dbCommit = async () => {
        await fs.writeFile('db.json', JSON.stringify(this._db, null, 4));
        this.clearCache();
    }
}

class DBSqliteProvider implements IDBProvider {
    dbFile: string;

    constructor(dbFile: string) {
        this.dbFile = dbFile;
    }
    _db = null;

    dbConnect = async () => {
        if (this._db)
            return this._db;

        const db = new sqlite3.Database(this.dbFile);
        this._db = db;
        return db;
    }

    clearCache = () => {
        this._db = null;
    }

    private prepareValue = (value) => {
        if(value == null) {
            return `null`;
        } else if(typeof value == 'string') {
            return `'${value.replace(/'/g,"''")}'`;
        } else if(typeof value == 'boolean') {
            return `${value ? 1 : 0}`;
        } else if(Array.isArray(value)) {
            return value.map(v => this.prepareValue(v)).join(', ');
        }

        return value;
    }

    private buildWhere = (where:ICondition[]) => {
        const conditions:string[] = ['1 = 1'];
        
        for (const cond of where) {
            if (cond.value == null) {
                conditions.push(`${cond.column} is null`);
                continue;
            }

            switch (cond.operator) {
                case Operator.Equals:
                    if (cond.value == null) {
                        conditions.push(`${cond.column} is null`);
                    } else {
                        conditions.push(`${cond.column} = ${this.prepareValue(cond.value)}`)
                    }                    
                    break;
                case Operator.Contains:
                    conditions.push(`${cond.column} like '%' || ${this.prepareValue(cond.value)} || '%'`)
                    break;
                case Operator.StartsWith:
                    conditions.push(`${cond.column} like '%' || ${this.prepareValue(cond.value)}`)
                    break;
                case Operator.EndsWith:
                    conditions.push(`${cond.column} like ${this.prepareValue(cond.value)} || '%'`)
                    break;
                case Operator.NotEquals:
                    if (cond.value == null) {
                        conditions.push(`${cond.column} is not null`);
                    } else {
                        conditions.push(`${cond.column} <> ${this.prepareValue(cond.value)}`)
                    } 
                    break;
                case Operator.GreaterThan:
                    conditions.push(`${cond.column} > ${this.prepareValue(cond.value)}`)
                    break;
                case Operator.LessThan:
                    conditions.push(`${cond.column} < ${this.prepareValue(cond.value)}`)
                    break;
                case Operator.IsIn:
                    conditions.push(`${cond.column} in (${this.prepareValue(cond.value)})`)
                    break;
                case Operator.IsNotIn:
                    conditions.push(`${cond.column} not in (${this.prepareValue(cond.value)})`)
                    break;
                case Operator.IsNull:
                    conditions.push(`${cond.column} is null`)
                    break;
                case Operator.IsNotNull:
                    conditions.push(`${cond.column} is not null`)
                    break;
            }
        }
        return conditions.join(' and ');
    }

    dbCount = async (table: string, where: ICondition[] = []):Promise<number> => {
        const db = await this.dbConnect();
        const conditions = this.buildWhere(where);
        return new Promise((resolve, reject) => {
            db.all(`select count(*) as total from ${table} where ${conditions}`, (err, data) => {
                if(err) {
                    return reject(err.message);
                }
                return resolve(data.total as number);
            })
        });
    }

    dbSelect = async (table: string, where: ICondition[] = [], sort: ISort[] = []) => {
        const db = await this.dbConnect();
        const conditions = this.buildWhere(where);
        const orders = 'id';
        const fetchData = async():Promise<IEntity[]> => {
            return new Promise((resolve, reject) => {
                const sql = `select * from ${table} where ${conditions} order by ${orders}`
                db.all(sql, (err, data) => {
                    if(err) {
                        return reject(err.message + ' ' + sql);
                    }
                    return resolve(data as IEntity[]);
                })
            });    
        }

        const results = await fetchData();
        console.log('RESULTS:');
        console.dir(results);

        return { result: results, count: results.length, total: results.length } as IQueryResult<IQuery, IEntity>;
    }

    dbInsert = async (table: string, record: IEntity):Promise<IEntity> => {
        const db = await this.dbConnect();
        const columns = Object.entries(record).map(x => x[0]).join(', ');
        const values = Object.entries(record).map(x => this.prepareValue(x[1])).join(', ');
        return new Promise((resolve, reject) => {
            db.run('BEGIN');
            db.run(`insert into ${table}(${columns}) select ${values}`, (err) => {
                if(err) {
                    db.run('ROLLBACK');
                    return reject(err.message);
                }
                return resolve(record);
            })
        }); 
    }

    dbDelete = async (table: string, id: string):Promise<boolean> => {
        const db = await this.dbConnect();
        return new Promise((resolve, reject) => {
            db.run('BEGIN');
            db.run(`delete from ${table} where id = ${this.prepareValue(id)}`, (err) => {
                if(err) {
                    db.run('ROLLBACK');
                    return reject(err.message);
                }
                return resolve(true);
            })
        });
    }

    dbUpdate = async (table: string, record: IEntity):Promise<IEntity> => {
        const db = await this.dbConnect();
        const values = Object.entries(record).map(x => `${x[0]} = ${this.prepareValue(x[1])}`).join(', ');
        return new Promise((resolve, reject) => {
            db.run('BEGIN');
            db.run(`update ${table} set ${values} where id = ${this.prepareValue(record.id)}`, (err) => {
                if(err) {
                    db.run('ROLLBACK');
                    return reject(err.message);
                }
                return resolve(record);
            })
        });
    }

    dbCommit = async () => {
        const db = await this.dbConnect();
        db.run('COMMIT');
        this.clearCache();
    }
}

export class DBProvider {
    // private static _provider = new DBJSONProvider('db.json');
    private static _provider = new DBSqliteProvider('db/invoices.sqlite');

    static dbConnect = async () => {
        return this._provider.dbConnect();
    }

    static clearCache = () => {
        this._provider.clearCache();
    }

    static dbCount = async (table: string, where: ICondition[] = []) => {
        return this._provider.dbCount(table, where);
    }

    static dbSelect = async (table: string, where: ICondition[] = [], sort: ISort[] = []) => {
        return this._provider.dbSelect(table, where, sort);
    }

    static dbInsert = async (table: string, record: IEntity) => {
        const result = this._provider.dbInsert(table, record);
        this._provider.dbCommit();
        return result;
    }

    static dbDelete = async (table: string, id: string) => {
        const result =  this._provider.dbDelete(table, id);
        this._provider.dbCommit();
        return result;
    }

    static dbUpdate = async (table: string, record: IEntity) => {
        const result =  this._provider.dbUpdate(table, record);
        this._provider.dbCommit();
        return result;

    }

    static dbCommit = async () => {
        return this._provider.dbCommit()
    }

}



export interface IDBProvider {
    dbConnect: () => {};
    clearCache: () => void;
    dbCount: (table: string, where: ICondition[]) => Promise<Number>;
    dbSelect: (table: string, where: ICondition[], sort: ISort[]) => Promise<IQueryResult<IQuery, IEntity>>;
    dbInsert: (table: string, record: IEntity) => Promise<IEntity>;
    dbUpdate: (table: string, record: IEntity) => Promise<IEntity>;
    dbDelete: (table: string, id: string) => Promise<boolean>;
    dbCommit: () => Promise<void>;
}