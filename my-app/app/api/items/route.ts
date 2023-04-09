import { NextRequest, NextResponse } from "next/server";

import { ICondition, IItem, IItemQuery, ISort, Operator, SortDirection } from "../../classes";
import { ServerUtil } from "../util";

const tableName = 'items';

export async function GET(req: NextRequest) {
    const params = Object.fromEntries(req.nextUrl.searchParams) as unknown as IItemQuery;

    var where = [];
    var sort = [];

    if (params) {
        if(params.search?.length > 0)
            where.push({column: 'name', operator: Operator.Contains, value: params.search} as ICondition);
        if(params.category_id?.length > 0)
            where.push({column: 'category_id', operator: Operator.Equals, value: params.category_id} as ICondition);
        if(params.sortby)
            sort = [{column: params.sortby, direction: params.sortdir == 'asc' ? SortDirection.Asc : SortDirection.Desc} as ISort];
    }

    return NextResponse.json(
        await ServerUtil.dbSelect(tableName, where, sort) as IItem[]
    )
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


