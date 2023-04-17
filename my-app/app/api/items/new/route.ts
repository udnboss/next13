import { NextRequest, NextResponse } from "next/server";
import { IItem } from "../../../classes";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    const id = crypto.randomUUID();
    return NextResponse.json({id: id, category_id: null, name: ''} as IItem);
}