import { NextRequest, NextResponse } from "next/server";

import { ICondition, IQueryResult, ISale, ISaleQuery, ICustomer, ICustomerQuery, ISort, Operator, SortDirection } from "../../classes";
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

    const sales = await ServerUtil.dbSelect(tableName, where, sort) as IQueryResult<ISaleQuery, ISale>;
    
    const customer_ids = sales.result.map(x => x.customer_id).filter((v,i,a) => a.indexOf(v) === i);
    const customers = await ServerUtil.dbSelect('customers', [{column: 'id', operator: Operator.IsIn, value: customer_ids} as ICondition], sort) as IQueryResult<ICustomerQuery, ICustomer>;
    const customersLookup = Object.fromEntries(customers.result.map(x => [x.id, x]));

    for(const sale of sales.result) {
        sale.customer = sale.customer_id != null ? customersLookup[sale.customer_id] : null;
    }

    return NextResponse.json(sales);
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


