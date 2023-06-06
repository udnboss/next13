import { NextRequest, NextResponse } from "next/server";

import { ICondition, IQueryResult, ISale, ISaleQuery, ICustomer, ICustomerQuery, ISort, Operator, SortDirection, IQuery, ICurrency } from "../../classes";
import { DBProvider } from "../util";
import crypto from "crypto";

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

    const sales = await DBProvider.dbSelect(tableName, where, sort) as IQueryResult<ISaleQuery, ISale>;
    
    const customer_ids = sales.result.map(x => x.customer_id).filter((v,i,a) => a.indexOf(v) === i);
    const customers = await DBProvider.dbSelect('customers', [{column: 'id', operator: Operator.IsIn, value: customer_ids} as ICondition], [{column: "id", direction: SortDirection.Asc} as ISort]) as IQueryResult<ICustomerQuery, ICustomer>;
    const customersLookup = Object.fromEntries(customers.result.map(x => [x.id, x]));
   
    const currencies = await DBProvider.dbSelect('currencies') as IQueryResult<IQuery, ICurrency>;
    const currenciesLookup = Object.fromEntries(currencies.result.map(x => [x.id, x]));

    for(const sale of sales.result) {
        sale.customer = sale.customer_id != null ? customersLookup[sale.customer_id] : null;
        sale.currency = sale.currency_id != null ? currenciesLookup[sale.currency_id] : null;
    }

    return NextResponse.json(sales);
}

export async function POST(req: NextRequest) {
    const newSale = await req.json() as ISale;

    //auto set values 
    newSale.id = crypto.randomUUID();
    newSale.number = await DBProvider.dbCount(tableName) + 1;
    
    return NextResponse.json(
        await DBProvider.dbInsert(tableName, newSale)
    )
}

export async function PUT(req: NextRequest) {
    const sale = await req.json() as ISale;

    return NextResponse.json(        
        await DBProvider.dbUpdate(tableName, sale)
    )
}


