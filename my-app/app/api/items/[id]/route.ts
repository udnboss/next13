import { NextRequest, NextResponse } from "next/server";
import { ICondition, Operator } from "../../../classes";
import { ServerUtil } from "../../util";

const tableName = 'items';

export async function GET(req: NextRequest, { params }) {
    const where = [{column: 'id', operator: Operator.Equals, value: params.id} as ICondition];
    const items = await ServerUtil.dbSelect(tableName, where);
    if (items.length) {
        return NextResponse.json(items[0]);
    }

    return NextResponse.json({}, { status: 404});
}

export async function DELETE(req: NextRequest, { params }) {        
    return NextResponse.json(
        await ServerUtil.dbDelete(tableName, params.id)
    )
}