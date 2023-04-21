import { NextRequest, NextResponse } from "next/server";
import { ICompany } from "../../../classes";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    const id = crypto.randomUUID();
    return NextResponse.json({id: id, name: '', address: '', contact: '', crn: '', trn: '', email: '', mobile: ''} as ICompany);
}