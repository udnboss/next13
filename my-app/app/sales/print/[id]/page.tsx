'use client';

import { useEffect, useState } from "react";
import { ISale } from "../../../classes";
import { useSalesContext } from "../../context";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function PrintSale({params}) {
    const router = useRouter();
    const context = useSalesContext();
    const [sale, setSale] = useState<ISale>();

    useEffect(() => {
        async function fetchData(id:string) {
            setSale(await context.getSale(id));            
        }

        fetchData(params.id);
    }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps
    return ( sale &&
        <>
        <Button variant="secondary" onClick={() => router.push(`/sales/${sale.id}`)}>Back</Button>
        <div id="invoice">
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

                            <div>Invoice Number: { sale.number }</div>
                            
                            <div>Issue Date: { sale.date }</div>

                            <div>Place of Supply: { sale.place }</div>

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
                        <th>Description</th>
                        <th style={{width:'40px'}}>Quantity</th>
                        <th style={{width:'50px'}}>Price</th>
                        <th style={{width:'60px'}}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {sale.items?.map( saleitem => (
                        <tr key={saleitem.id}>
                            <td>{ saleitem.item?.name } - { saleitem.description }</td>
                            <td>{ saleitem.quantity }</td>
                            <td>{ saleitem.price }</td>
                            <td className="text-end">{ sale.customer?.currency } { Number(saleitem.quantity * saleitem.price).toLocaleString() }</td>
                        </tr>    
                    ))}                    
                </tbody>
                <tfoot >
                    <tr style={{borderTop:'solid 2px black'}}>
                        <td colSpan={3} >Total</td>
                        <td className="text-end text-bold">{ sale.customer?.currency } { Number(sale.total).toLocaleString() }</td>
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