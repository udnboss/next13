import { NextRequest, NextResponse } from "next/server";
import { Util } from "../../../util";
import { IItem } from "../../classes";

export async function GET(req: NextRequest, context: { params }) {

    return NextResponse.json(
        Util.itemsDbTable
    )
}

export async function POST(req: NextRequest, context: { params }) {
    const newItem = context.params as IItem;
    Util.itemsDbTable.push(newItem);

    return NextResponse.json(
        newItem
    )
}

export async function PUT(req: NextRequest) {
    const updatedItem = JSON.parse(req.body as any) as IItem;
    const index = Util.itemsDbTable.findIndex((item) => item.id == updatedItem.id);
    if (index > -1) {
        Util.itemsDbTable[index] = updatedItem;
    }

    return NextResponse.json(
        updatedItem
    )
}

export async function DELETE(req: NextRequest, context: { params }) {    
    const index = Util.itemsDbTable.findIndex((item) => item.id == context.params.id);
    const item = Util.itemsDbTable[index];

    if (index > -1) {
        Util.itemsDbTable.splice(index, 1);
    }

    return NextResponse.json(
        item
    )
}
