import { NextRequest, NextResponse } from "next/server";

import { ICondition, ICustomer, ICustomerQuery, ISort, Operator, SortDirection, IQueryResult } from "../../classes";
import { ServerUtil } from "../util";

const tableName = 'customers';

//handles client calls
export async function GET(req: NextRequest) {
    return NextResponse.json(
        await get(req.nextUrl.searchParams)
    )
}

//use for server side calls
export async function get(searchParams:URLSearchParams) {
    const params = Object.fromEntries(searchParams) as unknown as ICustomerQuery;

    var where:ICondition[] = [];
    var sort:ISort[] = [];

    if (params) {
        if(params.search?.length > 0)
            where.push({column: 'name', operator: Operator.Contains, value: params.search} as ICondition);
        if(params.sortby)
            sort = [{column: params.sortby, direction: params.sortdir == 'asc' ? SortDirection.Asc : SortDirection.Desc} as ISort];
    }

    const result = await ServerUtil.dbSelect(tableName, where, sort) as IQueryResult<ICustomerQuery, ICustomer>;
    return result;
}

export async function POST(req: NextRequest) {
    const newCustomer = await req.json() as ICustomer;

    return NextResponse.json(
        await ServerUtil.dbInsert(tableName, newCustomer)
    )
}

export async function PUT(req: NextRequest) {
    const customer = await req.json() as ICustomer;

    return NextResponse.json(
        await ServerUtil.dbUpdate(tableName, customer)
    )
}


