import { NextRequest, NextResponse } from "next/server";

import { ICondition, IItem, IItemQuery, IQueryResult, ISale, ISaleItem, ISaleItemQuery, ISaleQuery, ISort, Operator, SortDirection } from "../../classes";
import { DBProvider } from "../util";

const tableName = 'saleitems';

export async function POST(req: NextRequest) {
    const newSaleItem = await req.json() as ISaleItem;

    const inserted = await DBProvider.dbInsert(tableName, newSaleItem) as ISaleItem;

    inserted.item = await getItem(inserted.item_id as string);
    await updateSaleTotal(newSaleItem.sale_id as string);
    
    return NextResponse.json(
        inserted
    )
}

export const updateSaleTotal = async (sale_id:string) => {
    //update total
    const saleitems = await DBProvider.dbSelect(tableName, [{column: 'sale_id', operator: Operator.Equals, value: sale_id} as ICondition]) as IQueryResult<ISaleItemQuery, ISaleItem>;
    const total = saleitems.result.reduce((total, saleitem) => total + (saleitem.quantity * saleitem.price), 0);
    const saleResults = await DBProvider.dbSelect('sales', [{column: 'id', operator: Operator.Equals, value: sale_id} as ICondition]) as IQueryResult<ISaleQuery, ISale>;
    if(saleResults.count == 0)
        throw new Error("Sale not found");

    const sale = saleResults.result[0];
    sale.total = total;
    await DBProvider.dbUpdate('sales', sale);    
}

const getItem = async (id:string) => {
    return (await DBProvider.dbSelect('items', [{column:'id', operator: Operator.Equals, value: id} as ICondition]) as IQueryResult<IItemQuery, IItem>).result[0] as IItem;
}

export async function PUT(req: NextRequest) {
    const saleItem = await req.json() as ISaleItem;

    const updated = await DBProvider.dbUpdate(tableName, saleItem) as ISaleItem;

    updated.item = await getItem(updated.item_id as string);

    await updateSaleTotal(saleItem.sale_id as string);
    

    return NextResponse.json(updated)
}


