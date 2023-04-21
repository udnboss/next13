import { NextRequest, NextResponse } from "next/server";
import { ICurrency, ICurrencyQuery, ICondition, IQueryResult, Operator } from "../../../classes";
import { ServerUtil } from "../../util";

const tableName = 'currencies';

export async function GET(req: NextRequest, { params }) {
    const where = [{column: 'id', operator: Operator.Equals, value: params.id} as ICondition];
    const result = await ServerUtil.dbSelect(tableName, where) as IQueryResult<ICurrencyQuery, ICurrency>;
    if (result.count) {
        return NextResponse.json(result.result[0]);
    }

    return NextResponse.json({}, { status: 404});
}

export async function DELETE(req: NextRequest, { params }) {        
    return NextResponse.json(
        await ServerUtil.dbDelete(tableName, params.id)
    );
}