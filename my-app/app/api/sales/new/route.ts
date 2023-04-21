import { NextRequest, NextResponse } from "next/server";
import { ICondition, ISale } from "../../../classes";
import crypto from "crypto";
import { ServerUtil } from "../../util";

export async function GET(req: NextRequest) {
    const id = crypto.randomUUID();
    const number = await ServerUtil.dbCount('sales') + 1;
    return NextResponse.json({id: id, company_id: '1', place: '', currency_id: '1', account_id: '1', customer_id: '1', date: new Date().toISOString().substring(0, 10), confirmed: false, number: number, total: 0, reference: ''} as ISale);
}