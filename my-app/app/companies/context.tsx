'use client';

import { createContext, ReactNode, useContext, useReducer, useEffect, useState } from "react";
import { ClientUtil } from "../../util";
import { ICompany, ICompanyQuery, IQueryResult } from "../classes";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type companiesContextType = {
    companies: ICompany[];
    query: ICompanyQuery;
    pending: boolean;
    searchCompanies: (search: string) => Promise<void>;
    getCompanies: () => Promise<ICompany[]>;
    getCompany: (id: string) => Promise<ICompany>;
    insertCompany: (company: ICompany) => Promise<ICompany>;
    deleteCompany: (company: ICompany) => Promise<boolean>;
    updateCompany: (company: ICompany) => Promise<ICompany>;
};

export const CompaniesContext = createContext<companiesContextType>({} as companiesContextType);

// context consumer hook
export const useCompaniesContext = () => {
    // get the context
    const context = useContext(CompaniesContext);

    // if `undefined`, throw an error
    if (context === undefined) {
        throw new Error("useCompaniesContext was used outside of its Provider");
    }

    return context;
};


function companiesReducer(companies, action) {
    console.log(`dispatched: ${action.type}`);
    console.log(companies);
    switch (action.type) {
        case 'refreshed': {
            return [...action.data];
        }        
        case 'added': {
            return [...companies, action.data];
        }
        case 'changed': {
            return companies.map(t => {
                if (t.id === action.data.id) {
                    return action.company;
                } else {
                    return t;
                }
            });
        }
        case 'deleted': {
            return companies.filter(t => t.id !== action.data);
        }

        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export function CompaniesProvider({ children }: { children: ReactNode }) {
    const [companies, dispatch] = useReducer(
        companiesReducer,
        []
    );

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [query, setQuery] = useState<ICompanyQuery>({} as ICompanyQuery);
    // const [companies, setCompanies] = useState<ICompany[]>([] as ICompany[]);
    const [pending, setPending] = useState<boolean>(false);

    useEffect(() => {
        console.log('searchParams changed');
        setQuery(Object.fromEntries(searchParams?.entries() || []) as unknown as ICompanyQuery);
    }, [searchParams])

    useEffect(() => {
        async function fetchData() {
            await getCompanies();
        };
        fetchData();
    }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

    const searchCompanies = async (search: string) => {
        const params = new URLSearchParams(searchParams as unknown as URLSearchParams);
        params.set('search', search);
        router.push(pathname + '?' + params.toString());
    }

    const getCompanies = async () => {

        const params = query != null ? new URLSearchParams(Object.entries(query)).toString() : '';
        setPending(true);
        const data = await ClientUtil.get(`/api/companies?${params}`) as unknown as IQueryResult<ICompanyQuery, ICompany>;
        // setCompanies(data.result);
        dispatch({type: 'refreshed', data: data.result});
        setPending(false);
        return data.result;
    };

    const getCompany = async (id: string) => {
        setPending(true);
        const result = await ClientUtil.get(`/api/companies/${id}`) as unknown as ICompany;
        setPending(false);
        return result;
    }

    const getCleanCopy = (data:ICompany) => {
        const cleanData = {...data};

        return cleanData;
    }

    const insertCompany = async (company: ICompany) => {
        setPending(true);
        const result = await ClientUtil.post('/api/companies', getCleanCopy(company)) as unknown as ICompany;
        setPending(false);
        dispatch({type: 'added', data: result});
        // await getCompanies();
        return result;
    }

    const deleteCompany = async (company: ICompany) => {
        setPending(true);
        const result = await ClientUtil.delete(`/api/companies/${company.id}`) as unknown as boolean;
        setPending(false);
        dispatch({type: 'deleted', data: company.id});
        // await getCompanies();
        return result;
    }

    const updateCompany = async (company: ICompany) => {
        setPending(true);
        const result = await ClientUtil.put(`/api/companies`, getCleanCopy(company)) as unknown as ICompany;
        setPending(false);
        dispatch({type: 'changed', data: result});
        // await getCompanies();
        return result;
    }

    const value = { companies, query, pending, searchCompanies, getCompanies, deleteCompany, insertCompany, updateCompany, getCompany };

    return (
        <CompaniesContext.Provider value={value}>
            {children}
        </CompaniesContext.Provider>
    )
}