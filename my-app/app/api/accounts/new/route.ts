import { NextRequest, NextResponse } from "next/server";
import { IAccount } from "../../../classes";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    const id = crypto.randomUUID();
    return NextResponse.json({id: id, label: '', bank_name: '', bank_address: '', bank_swift: '', account_name: '', account_address: '', account_iban: ''} as IAccount);
}