import { NextRequest, NextResponse } from "next/server";
import { ICurrency } from "../../../classes";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    const id = crypto.randomUUID();
    return NextResponse.json({id: id, name: '', symbol: ''} as ICurrency);
}