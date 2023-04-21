'use client';

import { useState } from "react";
import { ICurrency } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditCurrency } from "../edit";
import { useCurrenciesContext } from "../context";

export default function CreateCurrencyPage({params}){
    const router = useRouter();
    const context = useCurrenciesContext();
    const [currency, setCurrency] = useState<ICurrency>(params ??= {id: '', name: ''} as ICurrency);

    const handleSubmit = async (currency:ICurrency) => {
        const inserted = await context.insertCurrency(currency);
        router.push('/currencies');
    }

    return (currency &&
        <EditCurrency data={currency} disabled={false} onSubmit={handleSubmit} mode="create" allowDelete={false} ></EditCurrency>
    );
}