'use client';

import { useEffect, useRef, useState } from "react";
import { ISale } from "../../../classes";
import { useSalesContext } from "../../context";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { jsPDF } from 'jspdf';
import PrintPartialSale from "./partial";

export default function PrintSale({params}) {
    const router = useRouter();
    const context = useSalesContext();
    const [sale, setSale] = useState<ISale>();

    const pdfRef = useRef(null);

    useEffect(() => {
        async function fetchData(id:string) {
            setSale(await context.getSale(id));            
        }

        fetchData(params.id);
    }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCancel = async () => {
        router.push(`/sales/${(sale as ISale).id}`)
    };    

    return ( sale &&
        <PrintPartialSale sale={sale} onCancel={handleCancel}></PrintPartialSale>
    )
}