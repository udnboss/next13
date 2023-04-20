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
        router.push('/sales');
    }

    const handleDelete = async (sale:ISale) => {
        const deleted = await context.deleteSale(sale);        
        if(deleted) {
            await context.getSales();
        }
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

    return ( sale &&
        <>
            {!edit && 
            <Row>
                <Col>
                    <ViewSale sale={sale}></ViewSale>
                </Col>
                <Col className="text-end">
                    <Button variant="secondary" onClick={handleEdit}><i className="bi-pencil"></i> Edit</Button>
                    <Button variant="secondary ms-2" onClick={handlePrint}><i className="bi-printer"></i> Print</Button>
                </Col>                
            </Row>
            }
            {edit &&
                <EditSale data={sale} customers={context.customers as never[]} disabled={false} mode="update" 
                    onSubmit={handleSubmit} onCancel={handleCancel} allowDelete={true} onDelete={handleDelete}></EditSale>
            }
            <SaleItemsProvider sale_id={params.id}>
                <SaleItemsPage sale={sale} onChange={handleChange}></SaleItemsPage>
            </SaleItemsProvider>            
        </>
        
    );
}