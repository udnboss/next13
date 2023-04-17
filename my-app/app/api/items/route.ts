import { NextRequest, NextResponse } from "next/server";

import { ICategory, ICondition, IItem, IItemQuery, IQuery, IQueryResult, ISort, Operator, SortDirection } from "../../classes";
import { ServerUtil } from "../util";

const tableName = 'items';

export async function GET(req: NextRequest) {
    const params = Object.fromEntries(req.nextUrl.searchParams) as unknown as IItemQuery;

    var where:ICondition[] = [];
    var sort:ISort[] = [];

    if (params) {
        if(params.search?.length > 0)
            where.push({column: 'name', operator: Operator.Contains, value: params.search} as ICondition);
        if(params.category_id?.length > 0)
            where.push({column: 'category_id', operator: Operator.Equals, value: params.category_id} as ICondition);
        if(params.sortby)
            sort = [{column: params.sortby, direction: params.sortdir == 'asc' ? SortDirection.Asc : SortDirection.Desc} as ISort];
    }

    const items = await ServerUtil.dbSelect(tableName, where, sort) as IQueryResult<IItemQuery, IItem>;

    const category_ids = items.result.map(x => x.category_id).filter((v,i,a) => a.indexOf(v) === i);
    const categories = await ServerUtil.dbSelect('categories', [{column: 'id', operator: Operator.IsIn, value: category_ids} as ICondition], sort) as IQueryResult<IQuery, ICategory>;
    const categoriesLookup = Object.fromEntries(categories.result.map(x => [x.id, x]));

    for(const item of items.result) {
        item.category = item.category_id != null ? categoriesLookup[item.category_id] : null;
    }

    return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
    const newItem = await req.json() as IItem;

    return NextResponse.json(
        await ServerUtil.dbInsert(tableName, newItem)
    )
}

export async function PUT(req: NextRequest) {
    const item = await req.json() as IItem;

    return NextResponse.json(
        await ServerUtil.dbUpdate(tableName, item)
    )
}


