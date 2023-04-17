import { NextRequest, NextResponse } from "next/server";

import { ICondition, IQueryResult, ISale, ISaleItem, ISaleItemQuery, ISaleQuery, ISort, Operator, SortDirection } from "../../classes";
import { ServerUtil } from "../util";

const tableName = 'saleitems';

export async function POST(req: NextRequest) {
    const newSaleItem = await req.json() as ISaleItem;

    const inserted = await ServerUtil.dbInsert(tableName, newSaleItem);

    if(newSaleItem.sale_id != null) 
    {
        await updateSaleTotal(newSaleItem.sale_id);
    }

    return NextResponse.json(
        inserted
    )
}

export const updateSaleTotal = async (sale_id:string) => {
    //update total
    const saleitems = await ServerUtil.dbSelect(tableName, [{column: 'sale_id', operator: Operator.Equals, value: sale_id} as ICondition]) as IQueryResult<ISaleItemQuery, ISaleItem>;
    const total = saleitems.result.reduce((total, saleitem) => total + (saleitem.quantity * saleitem.price), 0);
    const sale = await ServerUtil.dbSelect('sales', [{column: 'id', operator: Operator.Equals, value: sale_id} as ICondition]) as IQueryResult<ISaleQuery, ISale>;
    sale.total = total;
    await ServerUtil.dbUpdate('sales', sale);
}

export async function PUT(req: NextRequest) {
    const saleItem = await req.json() as ISaleItem;

    const updated = await ServerUtil.dbUpdate(tableName, saleItem);

    if(saleItem.sale_id != null) 
    {
        await updateSaleTotal(saleItem.sale_id);
    }

    return NextResponse.json(updated)
}


