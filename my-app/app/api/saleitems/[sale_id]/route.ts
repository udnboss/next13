import { NextRequest, NextResponse } from "next/server";
import { ICondition, IQueryResult, ISaleItem, ISaleItemQuery, ISort, Operator } from "../../../classes";
import { ServerUtil } from "../../util";

const tableName = 'saleitems';

export async function GET(req: NextRequest, { params }) {

    var where:ICondition[] = [];
    var sort:ISort[] = [];

    if (params) {
        if(params.sale_id?.length > 0)
            where.push({column: 'sale_id', operator: Operator.Equals, value: params.sale_id} as ICondition);
    }

    return NextResponse.json(
        await ServerUtil.dbSelect(tableName, where, sort) as IQueryResult<ISaleItemQuery, ISaleItem>
    )
}

export async function DELETE(req: NextRequest, { params }) {        
    return NextResponse.json(
        await ServerUtil.dbDelete(tableName, params.id)
    )
}