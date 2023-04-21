
'use client';

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import { ISale, ISaleItem } from "../../classes"
import { useSaleItemsContext } from "./context";
import { EditSaleItem } from "./editsaleitem";
import { randomUUID } from "crypto";


export default function SaleItemsPage({sale, onChange = () => {}}: {sale:ISale, onChange: () => void}) {

    const context = useSaleItemsContext();
    const [editId, setEditId] = useState<string>('');
    const [newSaleItem, setNewSaleItem] = useState<ISaleItem>();    

    const handleEdit = async (saleItem: ISaleItem) => {
        setEditId(saleItem.id);
    }

    const handleCancel = async () => {
        setNewSaleItem(undefined);
        setEditId('');
        
    }

    const handleCreate = async () => {
        const newItem = await context.createSaleItem(context.sale_id);
        setNewSaleItem(newItem);
    }

    const handleInsert = async (saleItem: ISaleItem) => {
        const inserted = await context.insertSaleItem(saleItem);        
        await handleCancel();
        onChange();
    }
    
    const handleDelete = async (saleItem: ISaleItem) => {
        const deleted = await context.deleteSaleItem(saleItem);        
        await handleCancel();
        onChange();
    }

    const handleUpdate = async (saleItem: ISaleItem) => {
        const updated = await context.updateSaleItem(saleItem);        
        await handleCancel();
        onChange();
    }

    return (
        <div>
            <>
                <h2>SaleItems Page</h2>
                <div className="text-end mb-3">

                    <Button variant="primary" onClick={handleCreate}>
                        <i className="bi-plus-circle"></i> Add New Item
                    </Button>

                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item</th>
                            <th style={{width:'120px'}}>Price</th>
                            <th style={{width:'120px'}}>Total</th>
                            <th style={{width:'50px'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {context.saleItems?.map((saleItem, ix) => (
                            <tr key={editId == saleItem.id ? 'edit' : saleItem.id}>
                                {editId == saleItem.id &&
                                <>
                                    <td>
                                        {ix+1}
                                    </td>
                                    <td colSpan={5}>
                                        <EditSaleItem onSubmit={handleUpdate} allowDelete={true} data={saleItem} mode="update" onCancel={handleCancel} onDelete={handleDelete}></EditSaleItem>
                                    </td>
                                </>
                                }
                                                                
                                {editId !== saleItem.id &&
                                <>
                                    <td>
                                        {ix+1}
                                    </td>
                                    <td>
                                        {saleItem.item?.name}
                                        <div className="text-muted">{saleItem.description}</div>
                                    </td>
                                    <td dangerouslySetInnerHTML={{ __html: `${saleItem.quantity} x ${sale.currency?.symbol}${saleItem.price.toLocaleString(undefined, {maximumFractionDigits:2})}` }}>
                                    </td>
                                    <td>
                                        {sale.currency?.name} {(saleItem.quantity * saleItem.price).toLocaleString(undefined, {maximumFractionDigits:2})}
                                    </td>
                                    <td className="text-end">
                                        <Button variant="outline-secondary" disabled={context.pending} onClick={(e: FormEvent<HTMLButtonElement>) => handleEdit(saleItem)}>
                                            <i className="bi-pencil"></i>
                                        </Button>
                                    </td>
                                </>                                
                                }
                            </tr>
                        ))}                    
                        
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3}></td>
                            <td>{sale.currency?.name} {sale.total?.toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
                <div>
                    {newSaleItem && <EditSaleItem onSubmit={handleInsert} allowDelete={false} data={newSaleItem} mode="create" onCancel={handleCancel}></EditSaleItem>}
                </div>
            </>
        </div>
    )
}

