import { NextRequest, NextResponse } from "next/server";
import { ICompany, ICompanyQuery, ICondition, IQueryResult, Operator } from "../../../classes";
import { DBProvider } from "../../util";

const tableName = 'companies';

export async function GET(req: NextRequest, { params }) {
    const where = [{column: 'id', operator: Operator.Equals, value: params.id} as ICondition];
    const result = await DBProvider.dbSelect(tableName, where) as IQueryResult<ICompanyQuery, ICompany>;
    if (result.count) {
        return NextResponse.json(result.result[0]);
    }

    return NextResponse.json({}, { status: 404});
}

export async function DELETE(req: NextRequest, { params }) {        
    return NextResponse.json(
        await DBProvider.dbDelete(tableName, params.id)
    );
}