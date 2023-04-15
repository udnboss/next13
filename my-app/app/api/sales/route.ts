import { NextRequest, NextResponse } from "next/server";

import { ICondition, IQueryResult, ISale, ISaleQuery, ISort, Operator, SortDirection } from "../../classes";
import { ServerUtil } from "../util";

const tableName = 'sales';

export async function GET(req: NextRequest) {
    const params = Object.fromEntries(req.nextUrl.searchParams) as unknown as ISaleQuery;

    var where:ICondition[] = [];
    var sort:ISort[] = [];

    if (params) {
        if(params.search?.length > 0)
            where.push({column: 'name', operator: Operator.Contains, value: params.search} as ICondition);
        if(params.customer_id?.length > 0)
            where.push({column: 'customer_id', operator: Operator.Equals, value: params.customer_id} as ICondition);
        if(params.sortby)
            sort = [{column: params.sortby, direction: params.sortdir == 'asc' ? SortDirection.Asc : SortDirection.Desc} as ISort];
    }

    return NextResponse.json(
        await ServerUtil.dbSelect(tableName, where, sort) as IQueryResult<ISaleQuery, ISale>
    )
}

export async function POST(req: NextRequest) {
    const newSale = await req.json() as ISale;

    return NextResponse.json(
        await ServerUtil.dbInsert(tableName, newSale)
    )
}

export async function PUT(req: NextRequest) {
    const sale = await req.json() as ISale;

    return NextResponse.json(
        await ServerUtil.dbUpdate(tableName, sale)
    )
}

