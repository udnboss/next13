import { NextRequest, NextResponse } from "next/server";
import { Util } from "../../../../util";
import { IItem } from "../../../classes";

export async function GET(req: NextRequest, context: { params }) {

    const index = Util.itemsDbTable.findIndex((item) => item.id == context.params.id);
    if (index > -1) {
        return NextResponse.json(Util.itemsDbTable[index]);
    }

}
