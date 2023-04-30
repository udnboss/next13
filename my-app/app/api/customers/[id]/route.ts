import { NextRequest, NextResponse } from "next/server";
import { ICustomer, ICustomerQuery, ICondition, IQueryResult, Operator } from "../../../classes";
import { DBProvider } from "../../util";

const tableName = 'customers';

export async function GET(req: NextRequest, { params }) {
    const where = [{column: 'id', operator: Operator.Equals, value: params.id} as ICondition];
    const result = await DBProvider.dbSelect(tableName, where) as IQueryResult<ICustomerQuery, ICustomer>;
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