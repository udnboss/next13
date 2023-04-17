import { NextRequest, NextResponse } from "next/server";

import { ICondition, ICategory, ICategoryQuery, ISort, Operator, SortDirection, IQueryResult } from "../../classes";
import { ServerUtil } from "../util";

const tableName = 'categories';

export async function GET(req: NextRequest) {
    const params = Object.fromEntries(req.nextUrl.searchParams) as unknown as ICategoryQuery;

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

    const result = await ServerUtil.dbSelect(tableName, where, sort) as IQueryResult<ICategoryQuery, ICategory>;
    return NextResponse.json(
        result
    )
}

export async function POST(req: NextRequest) {
    const newCategory = await req.json() as ICategory;

    return NextResponse.json(
        await ServerUtil.dbInsert(tableName, newCategory)
    )
}

export async function PUT(req: NextRequest) {
    const category = await req.json() as ICategory;

    return NextResponse.json(
        await ServerUtil.dbUpdate(tableName, category)
    )
}


