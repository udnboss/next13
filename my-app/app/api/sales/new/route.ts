import { NextRequest, NextResponse } from "next/server";
import { ISale } from "../../../classes";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    const id = crypto.randomUUID();
    return NextResponse.json({id: id, account_id: null, customer_id: null, date: new Date().toDateString(), confirmed: false, number: 0, total: 0, reference: ''} as ISale);
}