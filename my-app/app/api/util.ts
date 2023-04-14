import { promises as fs } from 'fs';
import { ISort, ICondition, Operator, SortDirection, IQueryResult, IQuery } from '../classes';

export class ServerUtil {
    static server = 'http://localhost:8001';

    static dbConnect = async () => {
        const result = await fs.readFile('db.json', 'utf-8');
        const db = JSON.parse(result);
        return db;
    }

    static dbSelect = async (table:string, where:ICondition[] = [], sort:ISort[] = []) => {
        const db = await this.dbConnect();
       
        const results = (db[table] as any[]).filter((x, i) => {
            for(const cond of where) {
                const value = x[cond.column];

                switch(cond.operator) {
                    case Operator.Equals:
                        if(value !== cond.value)
                            return false;
                        break;
                    case Operator.Contains:
                        if((value as string).indexOf(cond.value as string) === -1)
                            return false;    
                        break;
                    case Operator.StartsWith:
                        if(!(value as string).startsWith(cond.value as string))
                            return false;
                        break;
                    case Operator.EndsWith:
                        if(!(value as string).endsWith(cond.value as string))
                            return false;
                        break;
                    case Operator.NotEquals:
                        if(value === cond.value)
                            return false;
                        break;
                    case Operator.GreaterThan:
                        if(!(value > cond.value))
                            return false;
                        break;
                    case Operator.LessThan:
                        if(!(value < cond.value))
                            return false;
                        break;
                    case Operator.IsIn:
                        if((cond.value as unknown as any[]).indexOf(value) === -1)
                            return false;
                        break;
                    case Operator.IsNotIn:
                        if((cond.value as unknown as any[]).indexOf(value) !== -1)
                            return false;
                        break;
                    case Operator.IsNull:
                        if(value !== null)
                            return false;
                        break;
                    case Operator.IsNotNull:
                        if(value === null)
                            return false;
                        break;
                }                     
            }
            return true;
        });

        console.log('RESULTS:');
        console.dir(results);

        if(sort.length > 0) {
            results.sort((a, b) => {
                for(const s of sort){
                    const av = a[s.column];
                    const bv = b[s.column];
                    if(av < bv)
                        return s.direction == SortDirection.Asc ? -1 : 1;
                    if(av > bv)
                        return s.direction == SortDirection.Asc ? 1 : -1;                
                }

                return 0;            
            });    
        }

        return {result: results, count: results.length, total: results.length} as IQueryResult<IQuery, any>;
    }

    static dbInsert = async (table:string, record:any) => {
        const db = await this.dbConnect();
        db[table].push(record);
        await this.dbCommit(db);
        return record;
    }

    static dbDelete = async (table:string, id:string) => {
        const db = await this.dbConnect();
        const index = db[table].findIndex(x => x.id == id);
        if (index > -1) {
            (db[table] as []).splice(index, 1);
            await this.dbCommit(db);
            return true;
        }
        return false;
    }

    static dbUpdate = async (table:string, record:any) => {
        const db = await this.dbConnect();
        const index = db[table].findIndex(x => x.id == record.id);
        if (index > -1) {
            db[table][index] = record;
            await this.dbCommit(db);
        }
        return record;
        
    }

    static dbCommit = async (db) => {
        await fs.writeFile('db.json', JSON.stringify(db, null, 4));
    }

}
