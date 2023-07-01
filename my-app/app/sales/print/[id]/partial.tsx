'use client';

import { useEffect, useRef, useState } from "react";
import { ISale } from "../../../classes";
import { useSalesContext } from "../../context";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { jsPDF } from 'jspdf';

export default function PrintPartialSale({sale, onCancel}: {sale:ISale, onCancel: () => Promise<void>}) {
    const context = useSalesContext();
    const pdfRef = useRef(null);

    const handleDownload = () => {
        const d = new Date(sale.date);            
        var fileName = `${sale.customer_id}_${d.getFullYear()}_${(d.getMonth()).toString().padStart(2, '0')}.pdf`;
        fileName = prompt('enter filename', fileName) as string;
        const content = pdfRef.current as unknown as string;

        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts:true
           });
        doc.html(content, {
            callback: function (doc) {                    
                doc.save(fileName);
            },
            x: 10,
            y: 10,
            html2canvas: { letterRendering:true }, // change the scale to whatever number you need
            width: 315, // <- here
            windowWidth: 1000 // <- here
        });
    };    

    const handleCancel = () => {
        onCancel();
    }

    return ( sale &&
        <>
        <Button variant="secondary" onClick={handleCancel}>Close</Button>
        <Button variant="primary" className="ms-2" onClick={handleDownload}>Download</Button>
        <div ref={pdfRef} id="invoice">
            {/* <img src="logo_bw.png" style="display: block; position: absolute; top:20px; left:285px; " width="80px" />
            <img src="stamp.png" style="display: block; position: absolute; top:150px; left:500px; transform: rotate(3deg)" width="120px" />
            <img src="signature.png" style="display: block; position: absolute; top:200px; left:530px;" width="120px" /> */}

            <table style={{width: '100%', tableLayout: 'fixed', marginBottom: '20px'}}>
                <tbody>
                    <tr>
                        <td>
                            <h4>{sale.company?.name }</h4>
                            <div className="address">
                                <div>{ sale.company?.address }</div>

                                <div>{ sale.company?.contact }</div>

                                <div>{ sale.company?.email }</div>

                                <div>Commercial Registration: { sale.company?.crn }</div>

                                <div>Tax Registration Number: { sale.company?.trn }</div>
                            </div>
                        </td>
                        <td className="text-end">
                            <h2>Tax Invoice</h2>

                            <div>Invoice Number: { ("0000" + sale.number).slice(-4) }</div>
                            
                            <div>Issue Date: { new Date(sale.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) }</div>
                            
                            {sale.due_date && <div>Due Date: { new Date(sale.due_date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) }</div>}

                            {sale.place && <div>Place of Supply: { sale.place }</div>}

                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="address" style={{marginBottom:'20px'}}>
                <h3>Client</h3>

                <div>{ sale.customer?.name }</div>

                <div>{ sale.customer?.address }</div>

                <div>{ sale.customer?.contact }</div>
            </div>

            <table id="invoice_services" style={{width:"100%", border: '1', borderCollapse:"collapse", marginBottom:'50px'}}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Description</th>
                        <th style={{width:'40px'}}>Quantity</th>
                        <th style={{width:'50px'}}>Price</th>
                        <th style={{width:'60px'}}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {sale.items?.map( (saleitem, ix) => (
                        <tr key={saleitem.id}>
                            <td>{ix+1}</td>
                            <td>{ saleitem.item?.name } - { saleitem.description }</td>
                            <td className="text-end" >{ saleitem.quantity }</td>
                            <td className="text-end" dangerouslySetInnerHTML={{__html: sale.currency?.symbol + saleitem.price.toLocaleString()}}></td>
                            <td className="text-end" dangerouslySetInnerHTML={{__html: sale.currency?.symbol + Number(saleitem.quantity * saleitem.price).toLocaleString()}}></td>
                        </tr>    
                    ))}                    
                </tbody>
                <tfoot >
                    <tr style={{borderTop:'solid 2px black'}}>
                        <td className="text-end" colSpan={4} >Total including VAT</td>
                        <td className="text-end fw-bold" dangerouslySetInnerHTML={{__html: sale.currency?.symbol + Number(sale.total).toLocaleString()}}></td>
                    </tr>
                </tfoot>
            </table>

            <div style={{marginTop: '50px'}}>
                <p>Make Payments to:</p>

                <table id="invoice_payment">
                    <tbody>
                        <tr>
                            <td style={{width:'150px'}}>Bank Name</td>
                            <td>{ sale.account?.bank_name }</td>
                        </tr>
                        <tr>
                            <td>Bank Address</td>
                            <td>{ sale.account?.bank_address }</td>
                        </tr>
                        <tr>
                            <td>SWIFT Code</td>
                            <td>{ sale.account?.bank_swift }</td>
                        </tr>
                        <tr>
                            <td>Account Number IBAN</td>
                            <td>{ sale.account?.account_iban }</td>
                        </tr>
                        <tr>
                            <td>Account Holder Name</td>
                            <td>{ sale.account?.account_name }</td>
                        </tr>
                        <tr>
                            <td>Account Holder Address</td>
                            <td>{ sale.company?.address }</td>
                        </tr>
                        
                        
                    </tbody>
                </table>

                <p style={{marginTop: '50px'}}>For any concerns, please contact: { sale.company?.contact } - Mobile { sale.company?.mobile } - Email: 
                    { sale.company?.email }</p>

                <p style={{textAlign:'center'}}>Thank You for your business!</p>
                
            </div>
        </div>
        </>

    

        

    
    )
}