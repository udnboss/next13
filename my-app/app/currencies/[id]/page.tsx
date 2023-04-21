'use client';

import { useEffect, useState } from "react";
import { ICurrency } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditCurrency } from "../edit";
import { useCurrenciesContext } from "../context";



export default function CurrencyPage({params}){
    const router = useRouter();
    const context = useCurrenciesContext();
    const [currency, setCurrency] = useState<ICurrency>();

    useEffect(() => {
        async function fetchData(id:string) {
            setCurrency(await context.getCurrency(id));
        }

        fetchData(params.id);
    }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (currency:ICurrency) => {
        const updated = await context.updateCurrency(currency);
        router.push('/currencies');
    }

    const handleDelete = async (currency:ICurrency) => {
        const deleted = await context.deleteCurrency(currency);        
        if(deleted) {
            await context.getCurrencies();
        }
    }

    return ( currency &&
        <EditCurrency data={currency} disabled={false} onSubmit={handleSubmit} mode="update" allowDelete={true} onDelete={handleDelete}></EditCurrency>
    );
}