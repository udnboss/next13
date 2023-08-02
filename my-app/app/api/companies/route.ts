import { NextRequest, NextResponse } from "next/server";

import { ICondition, ICompany, ICompanyQuery, ISort, Operator, SortDirection, IQueryResult } from "../../classes";
import { DBProvider } from "../util";

const tableName = 'companies';

//handles client calls
export async function GET(req: NextRequest) {
    return NextResponse.json(
        await _get(req.nextUrl.searchParams)
    )
}

//use for server side calls
export async function _get(searchParams:URLSearchParams) {
    const params = Object.fromEntries(searchParams) as unknown as ICompanyQuery;

    var where:ICondition[] = [];
    var sort:ISort[] = [];

    if (params) {
        if(params.search?.length > 0)
            where.push({column: 'name', operator: Operator.Contains, value: params.search} as ICondition);
        if(params.sortby)
            sort = [{column: params.sortby, direction: params.sortdir == 'asc' ? SortDirection.Asc : SortDirection.Desc} as ISort];
    }

    const result = await DBProvider.dbSelect(tableName, where, sort) as IQueryResult<ICompanyQuery, ICompany>;
    return result;
}

export async function POST(req: NextRequest) {
    const newCompany = await req.json() as ICompany;

    return NextResponse.json(
        await DBProvider.dbInsert(tableName, newCompany)
    )
}

export async function PUT(req: NextRequest) {
    const company = await req.json() as ICompany;

    return NextResponse.json(
        await DBProvider.dbUpdate(tableName, company)
    )
}


