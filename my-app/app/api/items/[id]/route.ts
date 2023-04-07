import { NextRequest, NextResponse } from "next/server";
import { ServerUtil } from "../../util";

const tableName = 'items';

export async function GET(req: NextRequest, { params }) {

    const item = await ServerUtil.dbSelect(tableName, params.id);
    if (item) {
        return NextResponse.json(item);
    }

    return NextResponse.json({}, { status: 404});

}

export async function DELETE(req: NextRequest, { params }) {    
    console.log(params)
    return NextResponse.json(
        await ServerUtil.dbDelete(tableName, params.id)
    )
}