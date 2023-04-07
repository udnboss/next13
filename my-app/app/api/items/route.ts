import { NextRequest, NextResponse } from "next/server";

import { IItem } from "../../classes";
import { ServerUtil } from "../util";

const tableName = 'items';

export async function GET(req: NextRequest) {

    return NextResponse.json(
        await ServerUtil.dbSelect(tableName) as IItem
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


