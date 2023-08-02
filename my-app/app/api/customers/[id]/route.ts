import { NextRequest, NextResponse } from "next/server";
import { ICustomer, ICustomerQuery, ICondition, IQueryResult, Operator, IQuery, ICurrency } from "../../../classes";
import { DBProvider } from "../../util";

const tableName = 'customers';

export async function GET(req: NextRequest, { params }) {
    const where = [{column: 'id', operator: Operator.Equals, value: params.id} as ICondition];
    const result = await _get(params.id);
    if (result) {return NextResponse.json(result);}

    return NextResponse.json({}, { status: 404});
}

export async function _get(id:string) {
    const where = [{column: 'id', operator: Operator.Equals, value: id} as ICondition];
    const records = await DBProvider.dbSelect(tableName, where) as IQueryResult<ICustomerQuery, ICustomer>;

    if (records.count) {
        const record = records.result[0];

        if (record.currency_id) {
            const currencyResults = await DBProvider.dbSelect('currencies', [{column:'id', operator: Operator.Equals, value: record.currency_id} as ICondition]) as IQueryResult<IQuery, ICurrency>;
            if(currencyResults.count)
                record.currency = currencyResults.result[0];
        }
        
        return record;
    }

    return null;
}

export async function DELETE(req: NextRequest, { params }) {        
    return NextResponse.json(
        await DBProvider.dbDelete(tableName, params.id)
    );
}