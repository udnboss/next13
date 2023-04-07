import { promises as fs } from 'fs';

export class ServerUtil {
    static server = 'http://localhost:8001';

    static dbConnect = async () => {
        const result = await fs.readFile('db.json', 'utf-8');
        const db = JSON.parse(result);
        return db;
    }

    static dbSelect = async (table:string, id:string = null) => {
        const db = await this.dbConnect();
        if(id !== null) {
            const index = db[table].findIndex(x => x.id == id);
            if(index > -1){
                return db[table][index];    
            }
            return null;
            
        }
        return db[table] as any[];
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
