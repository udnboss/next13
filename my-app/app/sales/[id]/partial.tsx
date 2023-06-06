'use client';

import { useEffect, useState } from "react";
import { ISale } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditSale } from "../edit";
import { useSalesContext } from "../context";
import SaleItemsPage from "./saleitems";
import { SaleItemsProvider } from "./context";
import ViewSale from "./view";
import { Button, Col, Row } from "react-bootstrap";
import PrintPartialSale from "../print/[id]/partial";

export default function SalePartialPage({sale, onDelete, onDuplicate}: 
    {sale:ISale, onDelete: (deleted: ISale) => {}, onDuplicate: (sale: ISale) => {}}){
    const context = useSalesContext();

    const [edit, setEdit] = useState<boolean>(false);
    const [print, setPrint] = useState<boolean>(false);

    const handleSubmit = async (sale:ISale) => {
        const updated = await context.updateSale(sale);  
        setEdit(false);      
    }

    const handleDelete = async () => {
        const doDelete = confirm(`are you sure you want to delete this sale?`);
        if(doDelete){
            const deleted = await context.deleteSale(sale); 
            if(deleted)
                onDelete(sale);     
        }
        
    } 

    const handleCancel = async () => {
        setEdit(false);
        setPrint(false);
    }

    const handleEdit = async () => {
        setEdit(true);
    }

    const handlePrint = async () => {
        setPrint(true);
    }

    const handleChange = async () => {        
        await context.refreshSale(sale.id);
    }

    const handleDuplicate = async () => {             
        onDuplicate(sale);
    }

    return ( sale &&
        <>
            {!edit && !print &&
            <>
                <div className="text-end">
                    <Button variant="secondary" onClick={handleEdit}><i className="bi-pencil"></i> Edit</Button>
                    <Button variant="secondary ms-2" onClick={handlePrint}><i className="bi-printer"></i> Print</Button>
                    <Button variant="secondary ms-2" onClick={handleDuplicate}><i className="bi-file"></i> Duplicate</Button>
                    <Button variant="danger ms-2" onClick={handleDelete}><i className="bi-trash"></i> Delete</Button>
                </div> 
                <ViewSale sale={sale}></ViewSale>
                <SaleItemsProvider sale_id={sale.id}>
                    <SaleItemsPage sale={sale} onChange={handleChange}></SaleItemsPage>
                </SaleItemsProvider>
            </>            
            }
            {print &&
            <PrintPartialSale sale={sale} onCancel={handleCancel}></PrintPartialSale>
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