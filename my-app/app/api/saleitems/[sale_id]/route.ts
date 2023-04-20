import { NextRequest, NextResponse } from "next/server";
import { ICondition, IItem, IItemQuery, IQueryResult, ISaleItem, ISaleItemQuery, ISort, Operator } from "../../../classes";
import { ServerUtil } from "../../util";
import { updateSaleTotal } from "../route";

const tableName = 'saleitems';

export async function GET(req: NextRequest, { params }) {

    var where:ICondition[] = [];
    var sort:ISort[] = [];

    if (params) {
        if(params.sale_id?.length > 0)
            where.push({column: 'sale_id', operator: Operator.Equals, value: params.sale_id} as ICondition);
    }

    const saleItemsResult = await ServerUtil.dbSelect(tableName, where, sort) as IQueryResult<ISaleItemQuery, ISaleItem>;

    const itemIds = saleItemsResult.result.map(x => x.item_id).filter((v,i,a) => a.indexOf(v) === i);
    const itemsResult = await ServerUtil.dbSelect('items', [{column: 'id', operator: Operator.IsIn, value: itemIds} as ICondition]) as IQueryResult<IItemQuery, IItem>;
    const itemsLookup = Object.fromEntries(itemsResult.result.map(x => [x.id, x]));

    for(const saleItem of saleItemsResult.result){
        if (saleItem.item_id) {
            saleItem.item = saleItem.item_id != null ? itemsLookup[saleItem.item_id] : null;
        }    
    }
    
    return NextResponse.json(saleItemsResult);
}

export async function DELETE(req: NextRequest, { params }) {  
    const saleitemResults = await ServerUtil.dbSelect(tableName, [{column: 'id', operator: Operator.Equals, value: params.id} as ICondition]) as IQueryResult<ISaleItemQuery, ISaleItem>;

    const saleResults = await ServerUtil.dbSelect('sales', [{column: 'id', operator: Operator.Equals, value: saleitemResults.result[0].sale_id} as ICondition]);
    const sale = saleResults.result[0];

    const deleted = await ServerUtil.dbDelete(tableName, params.id);
    updateSaleTotal(sale.id)      
    return NextResponse.json(deleted);
}