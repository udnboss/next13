'use client';

import { createContext, ReactNode, useContext, useReducer, useEffect, useState } from "react";
import { ClientUtil } from "../../../util";
import { ISaleItem, ISaleItemQuery, IQueryResult } from "../../classes";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { randomUUID } from "crypto";

type saleItemsContextType = {
    sale_id:string,
    saleItems: ISaleItem[];    
    pending: boolean;
    getSaleItems: (sale_id:string) => Promise<ISaleItem[]>;
    createSaleItem: (sale_id:string) => Promise<ISaleItem>;
    insertSaleItem: (saleItem: ISaleItem) => Promise<ISaleItem>;
    deleteSaleItem: (saleItem: ISaleItem) => Promise<boolean>;
    updateSaleItem: (saleItem: ISaleItem) => Promise<ISaleItem>;
};

export const SaleItemsContext = createContext<saleItemsContextType>({} as saleItemsContextType);

// context consumer hook
export const useSaleItemsContext = () => {
    // get the context
    const context = useContext(SaleItemsContext);

    // if `undefined`, throw an error
    if (context === undefined) {
        throw new Error("useSaleItemsContext was used outside of its Provider");
    }

    return context;
};


function saleItemsReducer(saleItems: ISaleItem[], action): ISaleItem[] {
    console.log(`dispatched: ${action.type}`);
    console.log(saleItems);
    switch (action.type) {
        case 'refreshed': {
            return [...action.data];
        }        
        case 'added': {
            return [...saleItems, action.data];
        }
        case 'changed': {
            return saleItems.map(t => {
                if (t.id === action.data.id) {
                    return action.saleItem;
                } else {
                    return t;
                }
            });
        }
        case 'deleted': {
            return saleItems.filter(t => t.id !== action.data);
        }

        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export function SaleItemsProvider({ children, sale_id }: { children: ReactNode, sale_id:string }) {
    const [saleItems, dispatch] = useReducer(
        saleItemsReducer,
        []
    );

    const [pending, setPending] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            await getSaleItems(sale_id);
        }
        fetchData();
    }, [sale_id])

    const getSaleItems = async (sale_id:string) => {
        setPending(true);
        const data = await ClientUtil.get(`/api/saleitems/${sale_id}`) as unknown as IQueryResult<ISaleItemQuery, ISaleItem>;
        dispatch({type: 'refreshed', data: data.result});
        setPending(false);
        return data.result;
    };

    const createSaleItem = async (sale_id:string) => {
        const saleItem = await ClientUtil.get(`/api/saleitems/new`) as unknown as ISaleItem;
        saleItem.sale_id = sale_id;
        return saleItem;
    }

    const insertSaleItem = async (saleItem: ISaleItem) => {
        setPending(true);
        const result = await ClientUtil.post('/api/saleitems', saleItem) as unknown as ISaleItem;
        setPending(false);
        dispatch({type: 'added', data: result});
        return result;
    }

    const deleteSaleItem = async (saleItem: ISaleItem) => {
        setPending(true);
        const result = await ClientUtil.delete(`/api/saleitems/${saleItem.id}`) as unknown as boolean;
        setPending(false);
        dispatch({type: 'deleted', data: saleItem.id});
        return result;
    }

    const updateSaleItem = async (saleItem: ISaleItem) => {
        setPending(true);
        const result = await ClientUtil.put(`/api/saleitems`, saleItem) as unknown as ISaleItem;
        setPending(false);
        dispatch({type: 'changed', data: result});
        return result;
    }

    const value = { sale_id, saleItems, pending, getSaleItems, createSaleItem, insertSaleItem, deleteSaleItem, updateSaleItem };

    return (
        <SaleItemsContext.Provider value={value}>
            {children}
        </SaleItemsContext.Provider>
    )
}