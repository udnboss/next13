'use client';

import { createContext, ReactNode, useContext, useReducer, useEffect, useState } from "react";
import { ClientUtil } from "../../util";
import { ISale, ISaleQuery, IQueryResult } from "../classes";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type salesContextType = {
    sales: ISale[];
    query: ISaleQuery;
    pending: boolean;
    searchSales: (search: string) => Promise<void>;
    getSales: () => Promise<ISale[]>;
    getSale: (id: string) => Promise<ISale>;
    insertSale: (sale: ISale) => Promise<ISale>;
    deleteSale: (sale: ISale) => Promise<boolean>;
    updateSale: (sale: ISale) => Promise<ISale>;
};

export const SalesContext = createContext<salesContextType>({} as salesContextType);

// context consumer hook
export const useSalesContext = () => {
    // get the context
    const context = useContext(SalesContext);

    // if `undefined`, throw an error
    if (context === undefined) {
        throw new Error("useSalesContext was used outside of its Provider");
    }

    return context;
};


function salesReducer(sales, action) {
    console.log(`dispatched: ${action.type}`);
    console.log(sales);
    switch (action.type) {
        case 'refreshed': {
            return [...action.data];
        }        
        case 'added': {
            return [...sales, action.data];
        }
        case 'changed': {
            return sales.map(t => {
                if (t.id === action.data.id) {
                    return action.sale;
                } else {
                    return t;
                }
            });
        }
        case 'deleted': {
            return sales.filter(t => t.id !== action.data);
        }

        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export function SalesProvider({ children }: { children: ReactNode }) {
    const [sales, dispatch] = useReducer(
        salesReducer,
        []
    );

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [query, setQuery] = useState<ISaleQuery>({} as ISaleQuery);
    const [pending, setPending] = useState<boolean>(false);

    useEffect(() => {
        console.log('searchParams changed');
        setQuery(Object.fromEntries(searchParams?.entries() || []) as unknown as ISaleQuery);
    }, [searchParams])

    useEffect(() => {
        async function fetchData() {
            await getSales();
        };
        fetchData();
    }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

    const searchSales = async (search: string) => {
        const params = new URLSearchParams(searchParams as unknown as URLSearchParams);
        params.set('search', search);
        router.push(pathname + '?' + params.toString());
    }

    const getSales = async () => {

        const params = query != null ? new URLSearchParams(Object.entries(query)).toString() : '';
        setPending(true);
        const data = await ClientUtil.get(`/api/sales?${params}`) as unknown as IQueryResult<ISaleQuery, ISale>;
        // setSales(data.result);
        dispatch({type: 'refreshed', data: data.result});
        setPending(false);
        return data.result;
    };

    const getSale = async (id: string) => {
        setPending(true);
        const result = await ClientUtil.get(`/api/sales/${id}`) as unknown as ISale;
        setPending(false);
        return result;
    }

    const insertSale = async (sale: ISale) => {
        setPending(true);
        const result = await ClientUtil.post('/api/sales', sale) as unknown as ISale;
        setPending(false);
        dispatch({type: 'added', data: result});
        // await getSales();
        return result;
    }

    const deleteSale = async (sale: ISale) => {
        setPending(true);
        const result = await ClientUtil.delete(`/api/sales/${sale.id}`) as unknown as boolean;
        setPending(false);
        dispatch({type: 'deleted', data: sale.id});
        // await getSales();
        return result;
    }

    const updateSale = async (sale: ISale) => {
        setPending(true);
        const result = await ClientUtil.put(`/api/sales`, sale) as unknown as ISale;
        setPending(false);
        dispatch({type: 'changed', data: result});
        // await getSales();
        return result;
    }

    const value = { sales, query, pending, searchSales, getSales, deleteSale, insertSale, updateSale, getSale };

    return (
        <SalesContext.Provider value={value}>
            {children}
        </SalesContext.Provider>
    )
}