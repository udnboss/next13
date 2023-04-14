'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ClientUtil } from "../../util";
import { IItem, IItemQuery, IQueryResult } from "../classes";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type itemsContextType = {
    items: IItem[];
    query: IItemQuery;
    pending: boolean;
    searchItems:(search:string) => Promise<void>;
    getItems: () => Promise<IItem[]>;
    getItem: (id:string) => Promise<IItem>;
    insertItem: (item:IItem) => Promise<IItem>;
    deleteItem: (item:IItem) => Promise<boolean>;
    updateItem: (item:IItem) => Promise<IItem>;
};

export const ItemsContext = createContext<itemsContextType>({} as itemsContextType);

type Props = {
    children: ReactNode;
};

// context consumer hook
export const useItemsContext = () => {
    // get the context
    const context = useContext(ItemsContext);
  
    // if `undefined`, throw an error
    if (context === undefined) {
      throw new Error("useItemsContext was used outside of its Provider");
    }
  
    return context;
  };

export function ItemsProvider({children}: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [query, setQuery] = useState<IItemQuery>({} as IItemQuery);
    const [items, setItems] = useState<IItem[]>([] as IItem[]);
    const [pending, setPending] = useState<boolean>(false);

    useEffect( () => {
        console.log('searchParams changed');
        setQuery(Object.fromEntries(searchParams?.entries() || []) as unknown as IItemQuery);
    }, [searchParams])

    useEffect( () => {
        async function fetchData () {
            await getItems();
        };
        fetchData();
    }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

    const searchItems = async (search:string) => {
        const params = new URLSearchParams(searchParams as unknown as URLSearchParams);
        params.set('search', search);
        router.push(pathname + '?' + params.toString());
    }
    
    const getItems = async () => { 

        const params = query != null ? new URLSearchParams(Object.entries(query)).toString() : '';
        setPending(true);
        const data = await ClientUtil.get(`/api/items?${params}`) as unknown as IQueryResult<IItemQuery, IItem>; 
        setItems(data.result);
        setPending(false);
        return data.result;
    };

    const getItem = async (id:string) => {
        setPending(true);
        const result = await ClientUtil.get(`/api/items/${id}`) as unknown as IItem; 
        setPending(false);
        return result;
    }

    const insertItem = async (item:IItem) => {
        setPending(true);
        const result = await ClientUtil.post('/api/items', item) as unknown as IItem;
        setPending(false);
        await getItems();
        return result;
    }

    const deleteItem = async (item:IItem) => {
        setPending(true);
        const result = await ClientUtil.delete(`/api/items/${item.id}`) as unknown as boolean;
        setPending(false);
        await getItems();
        return result;
    }

    const updateItem = async (item:IItem) => {
        setPending(true);
        const result =  await ClientUtil.put(`/api/items`, item) as unknown as IItem; 
        setPending(false);
        await getItems();
        return result;
    }

    const value = {items, query, pending, searchItems, getItems, deleteItem, insertItem, updateItem, getItem};
        
    return (
        <ItemsContext.Provider value = {value}>
            {children}
        </ItemsContext.Provider>
    )
}