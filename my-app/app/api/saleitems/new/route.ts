import { NextRequest, NextResponse } from "next/server";
import { ISaleItem } from "../../../classes";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    const id = crypto.randomUUID();
    return NextResponse.json({id: id, sale_id: null, item_id: '', price: 0, quantity: 1, description: ''} as ISaleItem);
}