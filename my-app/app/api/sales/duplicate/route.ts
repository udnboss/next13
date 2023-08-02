import { NextRequest, NextResponse } from "next/server";
import { ISale } from "../../../classes";
import { DBProvider } from "../../util";
import crypto from "crypto";

const tableName = 'sales';

export async function POST(req: NextRequest, res: NextResponse) {
    const newSale = JSON.parse(JSON.stringify(await req.json())) as ISale;

    //auto set values 
    newSale.id = crypto.randomUUID();
    newSale.number = await DBProvider.dbCount(tableName) + 1;

    const lastMonth = new Date();    
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);

    const nextMonth = new Date();    
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);

    newSale.reference = lastMonth.toLocaleString('default', { month: 'long' }) + ' ' + lastMonth.getFullYear();
    newSale.date = new Date().toISOString().slice(0, 10);
    newSale.reference_date = lastMonth.toISOString().slice(0, 10);
    newSale.due_date = nextMonth.toISOString().slice(0, 10);

    await DBProvider.dbBegin();

    try{
        const insertedSale = await DBProvider.dbInsert(tableName, newSale) as ISale;

        //duplicate the items
        if(newSale.items && newSale.items.length) {
            for(const item of newSale.items) {
                item.id = crypto.randomUUID();
                item.sale_id = newSale.id;
                item.description = newSale.reference;
                await DBProvider.dbInsert('saleitems', item);
            }
        }

        insertedSale.items = newSale.items;   

        await DBProvider.dbCommit();
        return NextResponse.json(insertedSale);
    } catch(e) {
        await DBProvider.dbRollback();        
        return NextResponse.json(e, {status: 500});
    }    
    
    
}