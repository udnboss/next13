'use client';

import { useEffect, useState } from "react";
import { ISale } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditSale } from "../edit";
import { useSalesContext } from "../context";
import SaleItemsPage from "./saleitems";
import { SaleItemsProvider } from "./context";



export default function SalePage({params}){
    const router = useRouter();
    const context = useSalesContext();
    const [sale, setSale] = useState<ISale>();

    useEffect(() => {
        async function fetchData(id:string) {
            setSale(await context.getSale(id));
        }

        fetchData(params.id);
    }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (sale:ISale) => {
        const updated = await context.updateSale(sale);
        router.push('/sales');
    }

    const handleDelete = async (sale:ISale) => {
        const deleted = await context.deleteSale(sale);        
        if(deleted) {
            await context.getSales();
        }
    }

    return ( sale &&
        <>
            <EditSale data={sale} disabled={false} onSubmit={handleSubmit} mode="update" allowDelete={true} onDelete={handleDelete}></EditSale>
            <SaleItemsProvider sale_id={params.id}>
                <SaleItemsPage></SaleItemsPage>
            </SaleItemsProvider>            
        </>
        
    );
}