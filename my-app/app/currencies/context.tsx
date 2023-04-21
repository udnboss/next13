'use client';

import { createContext, ReactNode, useContext, useReducer, useEffect, useState } from "react";
import { ClientUtil } from "../../util";
import { ICurrency, ICurrencyQuery, IQueryResult } from "../classes";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type currenciesContextType = {
    currencies: ICurrency[];
    query: ICurrencyQuery;
    pending: boolean;
    searchCurrencies: (search: string) => Promise<void>;
    getCurrencies: () => Promise<ICurrency[]>;
    getCurrency: (id: string) => Promise<ICurrency>;
    insertCurrency: (currency: ICurrency) => Promise<ICurrency>;
    deleteCurrency: (currency: ICurrency) => Promise<boolean>;
    updateCurrency: (currency: ICurrency) => Promise<ICurrency>;
};

export const CurrenciesContext = createContext<currenciesContextType>({} as currenciesContextType);

// context consumer hook
export const useCurrenciesContext = () => {
    // get the context
    const context = useContext(CurrenciesContext);

    // if `undefined`, throw an error
    if (context === undefined) {
        throw new Error("useCurrenciesContext was used outside of its Provider");
    }

    return context;
};


function currenciesReducer(currencies, action) {
    console.log(`dispatched: ${action.type}`);
    console.log(currencies);
    switch (action.type) {
        case 'refreshed': {
            return [...action.data];
        }        
        case 'added': {
            return [...currencies, action.data];
        }
        case 'changed': {
            return currencies.map(t => {
                if (t.id === action.data.id) {
                    return action.currency;
                } else {
                    return t;
                }
            });
        }
        case 'deleted': {
            return currencies.filter(t => t.id !== action.data);
        }

        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export function CurrenciesProvider({ children }: { children: ReactNode }) {
    const [currencies, dispatch] = useReducer(
        currenciesReducer,
        []
    );

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [query, setQuery] = useState<ICurrencyQuery>({} as ICurrencyQuery);
    // const [currencies, setCurrencies] = useState<ICurrency[]>([] as ICurrency[]);
    const [pending, setPending] = useState<boolean>(false);

    useEffect(() => {
        console.log('searchParams changed');
        setQuery(Object.fromEntries(searchParams?.entries() || []) as unknown as ICurrencyQuery);
    }, [searchParams])

    useEffect(() => {
        async function fetchData() {
            await getCurrencies();
        };
        fetchData();
    }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

    const searchCurrencies = async (search: string) => {
        const params = new URLSearchParams(searchParams as unknown as URLSearchParams);
        params.set('search', search);
        router.push(pathname + '?' + params.toString());
    }

    const getCurrencies = async () => {

        const params = query != null ? new URLSearchParams(Object.entries(query)).toString() : '';
        setPending(true);
        const data = await ClientUtil.get(`/api/currencies?${params}`) as unknown as IQueryResult<ICurrencyQuery, ICurrency>;
        // setCurrencies(data.result);
        dispatch({type: 'refreshed', data: data.result});
        setPending(false);
        return data.result;
    };

    const getCurrency = async (id: string) => {
        setPending(true);
        const result = await ClientUtil.get(`/api/currencies/${id}`) as unknown as ICurrency;
        setPending(false);
        return result;
    }

    const getCleanCopy = (data:ICurrency) => {
        const cleanData = {...data};

        return cleanData;
    }

    const insertCurrency = async (currency: ICurrency) => {
        setPending(true);
        const result = await ClientUtil.post('/api/currencies', getCleanCopy(currency)) as unknown as ICurrency;
        setPending(false);
        dispatch({type: 'added', data: result});
        // await getCurrencies();
        return result;
    }

    const deleteCurrency = async (currency: ICurrency) => {
        setPending(true);
        const result = await ClientUtil.delete(`/api/currencies/${currency.id}`) as unknown as boolean;
        setPending(false);
        dispatch({type: 'deleted', data: currency.id});
        // await getCurrencies();
        return result;
    }

    const updateCurrency = async (currency: ICurrency) => {
        setPending(true);
        const result = await ClientUtil.put(`/api/currencies`, getCleanCopy(currency)) as unknown as ICurrency;
        setPending(false);
        dispatch({type: 'changed', data: result});
        // await getCurrencies();
        return result;
    }

    const value = { currencies, query, pending, searchCurrencies, getCurrencies, deleteCurrency, insertCurrency, updateCurrency, getCurrency };

    return (
        <CurrenciesContext.Provider value={value}>
            {children}
        </CurrenciesContext.Provider>
    )
}