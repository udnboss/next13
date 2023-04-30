import { NextRequest, NextResponse } from "next/server";

import { ICondition, IAccount, IAccountQuery, ISort, Operator, SortDirection, IQueryResult } from "../../classes";
import { DBProvider } from "../util";

const tableName = 'accounts';

//handles client calls
export async function GET(req: NextRequest) {
    return NextResponse.json(
        await get(req.nextUrl.searchParams)
    )
}

//use for server side calls
export async function get(searchParams:URLSearchParams) {
    const params = Object.fromEntries(searchParams) as unknown as IAccountQuery;

    var where:ICondition[] = [];
    var sort:ISort[] = [];

    if (params) {
        if(params.search?.length > 0)
            where.push({column: 'name', operator: Operator.Contains, value: params.search} as ICondition);
        if(params.sortby)
            sort = [{column: params.sortby, direction: params.sortdir == 'asc' ? SortDirection.Asc : SortDirection.Desc} as ISort];
    }

    const result = await DBProvider.dbSelect(tableName, where, sort) as IQueryResult<IAccountQuery, IAccount>;
    return result;
}

export async function POST(req: NextRequest) {
    const newAccount = await req.json() as IAccount;

    return NextResponse.json(
        await DBProvider.dbInsert(tableName, newAccount)
    )
}

export async function PUT(req: NextRequest) {
    const account = await req.json() as IAccount;

    return NextResponse.json(
        await DBProvider.dbUpdate(tableName, account)
    )
}


