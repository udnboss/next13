'use client';

import { createContext, ReactNode, useContext, useReducer, useEffect, useState } from "react";
import { ClientUtil } from "../../util";
import { IAccount, IAccountQuery, IQueryResult } from "../classes";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type accountsContextType = {
    accounts: IAccount[];
    query: IAccountQuery;
    pending: boolean;
    searchAccounts: (search: string) => Promise<void>;
    getAccounts: () => Promise<IAccount[]>;
    getAccount: (id: string) => Promise<IAccount>;
    insertAccount: (account: IAccount) => Promise<IAccount>;
    deleteAccount: (account: IAccount) => Promise<boolean>;
    updateAccount: (account: IAccount) => Promise<IAccount>;
};

export const AccountsContext = createContext<accountsContextType>({} as accountsContextType);

// context consumer hook
export const useAccountsContext = () => {
    // get the context
    const context = useContext(AccountsContext);

    // if `undefined`, throw an error
    if (context === undefined) {
        throw new Error("useAccountsContext was used outside of its Provider");
    }

    return context;
};


function accountsReducer(accounts, action) {
    console.log(`dispatched: ${action.type}`);
    console.log(accounts);
    switch (action.type) {
        case 'refreshed': {
            return [...action.data];
        }        
        case 'added': {
            return [...accounts, action.data];
        }
        case 'changed': {
            return accounts.map(t => {
                if (t.id === action.data.id) {
                    return action.account;
                } else {
                    return t;
                }
            });
        }
        case 'deleted': {
            return accounts.filter(t => t.id !== action.data);
        }

        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export function AccountsProvider({ children }: { children: ReactNode }) {
    const [accounts, dispatch] = useReducer(
        accountsReducer,
        []
    );

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [query, setQuery] = useState<IAccountQuery>({} as IAccountQuery);
    // const [accounts, setAccounts] = useState<IAccount[]>([] as IAccount[]);
    const [pending, setPending] = useState<boolean>(false);

    useEffect(() => {
        console.log('searchParams changed');
        setQuery(Object.fromEntries(searchParams?.entries() || []) as unknown as IAccountQuery);
    }, [searchParams])

    useEffect(() => {
        async function fetchData() {
            await getAccounts();
        };
        fetchData();
    }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

    const searchAccounts = async (search: string) => {
        const params = new URLSearchParams(searchParams as unknown as URLSearchParams);
        params.set('search', search);
        router.push(pathname + '?' + params.toString());
    }

    const getAccounts = async () => {

        const params = query != null ? new URLSearchParams(Object.entries(query)).toString() : '';
        setPending(true);
        const data = await ClientUtil.get(`/api/accounts?${params}`) as unknown as IQueryResult<IAccountQuery, IAccount>;
        // setAccounts(data.result);
        dispatch({type: 'refreshed', data: data.result});
        setPending(false);
        return data.result;
    };

    const getAccount = async (id: string) => {
        setPending(true);
        const result = await ClientUtil.get(`/api/accounts/${id}`) as unknown as IAccount;
        setPending(false);
        return result;
    }

    const getCleanCopy = (data:IAccount) => {
        const cleanData = {...data};
        return cleanData;
    }

    const insertAccount = async (account: IAccount) => {
        setPending(true);
        const result = await ClientUtil.post('/api/accounts', getCleanCopy(account)) as unknown as IAccount;
        setPending(false);
        dispatch({type: 'added', data: result});
        // await getAccounts();
        return result;
    }

    const deleteAccount = async (account: IAccount) => {
        setPending(true);
        const result = await ClientUtil.delete(`/api/accounts/${account.id}`) as unknown as boolean;
        setPending(false);
        dispatch({type: 'deleted', data: account.id});
        // await getAccounts();
        return result;
    }

    const updateAccount = async (account: IAccount) => {
        setPending(true);
        const result = await ClientUtil.put(`/api/accounts`, getCleanCopy(account)) as unknown as IAccount;
        setPending(false);
        dispatch({type: 'changed', data: result});
        // await getAccounts();
        return result;
    }

    const value = { accounts, query, pending, searchAccounts, getAccounts, deleteAccount, insertAccount, updateAccount, getAccount };

    return (
        <AccountsContext.Provider value={value}>
            {children}
        </AccountsContext.Provider>
    )
}