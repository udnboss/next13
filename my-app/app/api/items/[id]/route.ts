import { NextRequest, NextResponse } from "next/server";
import { ICondition, Operator } from "../../../classes";
import { DBProvider } from "../../util";

const tableName = 'items';

export async function GET(req: NextRequest, { params }) {
    const where = [{column: 'id', operator: Operator.Equals, value: params.id} as ICondition];
    const items = await DBProvider.dbSelect(tableName, where);
    if (items.count) {
        return NextResponse.json(items.result[0]);
    }

    return NextResponse.json({}, { status: 404});
}

export async function DELETE(req: NextRequest, { params }) {        
    return NextResponse.json(
        await DBProvider.dbDelete(tableName, params.id)
    )
}