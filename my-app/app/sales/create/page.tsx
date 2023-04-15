'use client';

import { useState } from "react";
import { ISale } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditSale } from "../edit";
import { useSalesContext } from "../context";

export default function CreateSalePage({params}){
    const router = useRouter();
    const context = useSalesContext();
    const [sale, setSale] = useState<ISale>(params ??= {id: ''} as ISale);

    const handleSubmit = async (sale:ISale) => {
        const inserted = await context.insertSale(sale);
        router.push('/sales');
    }

    return (sale &&
        <EditSale data={sale} disabled={false} onSubmit={handleSubmit} mode="create" allowDelete={false} ></EditSale>
    );
}