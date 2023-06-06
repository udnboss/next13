'use client';

import { useEffect, useState } from "react";
import { ISale } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditSale } from "../edit";
import { useSalesContext } from "../context";
import SaleItemsPage from "./saleitems";
import { SaleItemsProvider, useSaleItemsContext } from "./context";
import ViewSale from "./view";
import { Button, Col, Row } from "react-bootstrap";
import SalePartialPage from "./partial";



export default function SalePage({params}){
    const router = useRouter();
    const context = useSalesContext();

    const [sale, setSale] = useState<ISale>();
    const [edit, setEdit] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData(id:string) {
            setSale(await context.getSale(id));
        }

        fetchData(params.id);
    }, [params.id, context.sales]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (sale:ISale) => {
        const updated = await context.updateSale(sale);  
        setEdit(false);      
        // router.push(`/sales/${sale.id}`);
    }

    const handleDelete = async (sale:ISale) => {
        router.push(`/sales`);   
    } 

    const handleCancel = async () => {
        setEdit(false);
    }

    const handleEdit = async () => {
        setEdit(true);
    }

    const handlePrint = async () => {
        router.push(`/sales/print/${params.id}`);
    }

    const handleChange = async () => {
        // console.log('received a change from child')
        await context.refreshSale(params.id);
        // setSale(await context.getSale(params.id));
    }

    const handleDuplicate = async(sale:ISale) => {
        const newSale = await context.duplicateSale(sale);
        router.push(`/sales?id=${newSale.id}`);
    }

    const handleBack = async () => {
        router.push(`/sales?id=${sale?.id}`);
    }

    return ( sale &&
        <>
            {!edit && 
            <>
                <Button onClick={handleBack} variant="secondary">Back</Button>
                <SalePartialPage sale={sale} onDelete={handleDelete} onDuplicate={handleDuplicate}></SalePartialPage>
                
            </>            
            }
            {edit &&
                <EditSale data={sale} 
                    customers={context.customers as never[]} 
                    currencies={context.currencies as never[]} 
                    companies={context.companies as never[]} 
                    accounts={context.accounts as never[]} 
                    disabled={false} mode="update" 
                    onSubmit={handleSubmit} onCancel={handleCancel} allowDelete={true} onDelete={handleDelete}></EditSale>
            }
                        
        </>
        
    );
}