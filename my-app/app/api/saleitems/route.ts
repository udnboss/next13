import { NextRequest, NextResponse } from "next/server";

import { ICondition, IQueryResult, ISaleItem, ISaleItemQuery, ISort, Operator, SortDirection } from "../../classes";
import { ServerUtil } from "../util";

const tableName = 'saleitems';

export async function POST(req: NextRequest) {
    const newSaleItem = await req.json() as ISaleItem;

    return NextResponse.json(
        await ServerUtil.dbInsert(tableName, newSaleItem)
    )
}

export async function PUT(req: NextRequest) {
    const saleItem = await req.json() as ISaleItem;

    return NextResponse.json(
        await ServerUtil.dbUpdate(tableName, saleItem)
    )
}


