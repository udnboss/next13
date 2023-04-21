'use client';

import { useEffect, useState } from "react";
import { ISale } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditSale } from "../edit";
import { useSalesContext } from "../context";

export default function CreateSalePage({}){
    const router = useRouter();
    const context = useSalesContext();
    const [sale, setSale] = useState<ISale>();

    useEffect(() => {
        const fetchData = async() => {
            setSale(await context.createSale());
        }
        fetchData();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (sale:ISale) => {
        const inserted = await context.insertSale(sale);
        router.push('/sales');
    }

    return (sale &&
        <EditSale data={sale} 
            customers={context.customers as never[]} 
            currencies={context.currencies as never[]} 
            companies={context.companies as never[]} 
            accounts={context.accounts as never[]}
            disabled={false} onSubmit={handleSubmit} mode="create" allowDelete={false} ></EditSale>
    );
}