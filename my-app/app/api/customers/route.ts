import { NextRequest, NextResponse } from "next/server";

import { ICondition, ICustomer, ICustomerQuery, ISort, Operator, SortDirection, IQueryResult, IQuery, ICurrency } from "../../classes";
import { DBProvider } from "../util";

const tableName = 'customers';

//handles client calls
export async function GET(req: NextRequest) {
    return NextResponse.json(
        await _get(req.nextUrl.searchParams)
    )
}

//use for server side calls
export async function _get(searchParams:URLSearchParams) {
    const params = Object.fromEntries(searchParams) as unknown as ICustomerQuery;

    var where:ICondition[] = [];
    var sort:ISort[] = [];

    if (params) {
        if(params.search?.length > 0)
            where.push({column: 'name', operator: Operator.Contains, value: params.search} as ICondition);
        if(params.sortby)
            sort = [{column: params.sortby, direction: params.sortdir == 'asc' ? SortDirection.Asc : SortDirection.Desc} as ISort];
    }

    const queryResult = await DBProvider.dbSelect(tableName, where, sort) as IQueryResult<ICustomerQuery, ICustomer>;

    const currencies = await DBProvider.dbSelect('currencies') as IQueryResult<IQuery, ICurrency>;
    const currenciesLookup = Object.fromEntries(currencies.result.map(x => [x.id, x]));

    for(const record of queryResult.result) {
        record.currency = record.currency_id != null ? currenciesLookup[record.currency_id] : null;
    }
    
    return queryResult;
}

export async function POST(req: NextRequest) {
    const newCustomer = await req.json() as ICustomer;

    return NextResponse.json(
        await DBProvider.dbInsert(tableName, newCustomer)
    )
}

export async function PUT(req: NextRequest) {
    const customer = await req.json() as ICustomer;

    return NextResponse.json(
        await DBProvider.dbUpdate(tableName, customer)
    )
}


