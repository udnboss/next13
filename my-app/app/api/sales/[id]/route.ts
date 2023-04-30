import { NextRequest, NextResponse } from "next/server";
import { IAccount, ICompany, ICondition, ICurrency, ICustomer, IItem, IQuery, IQueryResult, ISale, ISaleItem, ISaleQuery, Operator } from "../../../classes";
import { DBProvider } from "../../util";

const tableName = 'sales';

export async function GET(req: NextRequest, { params }) {
    const where = [{column: 'id', operator: Operator.Equals, value: params.id} as ICondition];
    const sales = await DBProvider.dbSelect(tableName, where) as IQueryResult<ISaleQuery, ISale>;

    if (sales.count) {
        const sale:ISale = sales.result[0];

        if (sale.currency_id) {
            const currencyResults = await DBProvider.dbSelect('currencies', [{column:'id', operator: Operator.Equals, value: sale.currency_id} as ICondition]) as IQueryResult<IQuery, ICurrency>;
            if(currencyResults.count)
                sale.currency = currencyResults.result[0];
        }
        
        if (sale.company_id) {
            const companyResults = await DBProvider.dbSelect('companies', [{column:'id', operator: Operator.Equals, value: sale.company_id} as ICondition]) as IQueryResult<IQuery, ICompany>;
            if(companyResults.count)
                sale.company = companyResults.result[0];
        }   

        if(sale.account_id) {
            const accountResults = await DBProvider.dbSelect('accounts', [{column:'id', operator: Operator.Equals, value: sale.account_id} as ICondition]) as IQueryResult<IQuery, IAccount>;
                if(accountResults.count)
                    sale.account = accountResults.result[0];    
        }

        if(sale.customer_id) {
            const customerResults = await DBProvider.dbSelect('customers', [{column:'id', operator: Operator.Equals, value: sale.customer_id} as ICondition]) as IQueryResult<IQuery, ICustomer>;
                if(customerResults.count)
                    sale.customer = customerResults.result[0];    
        }

        const saleitemsResults = await DBProvider.dbSelect('saleitems', [{column: 'sale_id', operator: Operator.Equals, value: sale.id} as ICondition]) as IQueryResult<IQuery, ISaleItem>;
        const saleItems = saleitemsResults.result;
        const itemIds = saleItems.map(x => x.item_id).filter((v,i,a) => a.indexOf(v) == i);
        const itemsResults = await DBProvider.dbSelect('items', [{column: 'id', operator: Operator.IsIn, value: itemIds} as ICondition]) as IQueryResult<IQuery, IItem>;
        const itemsDict = Object.fromEntries(itemsResults.result.map(x => [x.id, x]));

        for (const saleItem of saleItems) {
            saleItem.item = saleItem.item_id != null ? itemsDict[saleItem.item_id] : null;
        }

        sale.items = saleItems;
         
        return NextResponse.json(sale);
    }

    return NextResponse.json({}, { status: 404});
}

export async function DELETE(req: NextRequest, { params }) {        
    return NextResponse.json(
        await DBProvider.dbDelete(tableName, params.id)
    )
}