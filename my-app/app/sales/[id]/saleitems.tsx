
'use client';

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import { ISaleItem } from "../../classes"
import { useSaleItemsContext } from "./context";
import { EditSaleItem } from "./editsaleitem";
import { randomUUID } from "crypto";


export default function SaleItemsPage() {

    const context = useSaleItemsContext();
    const [editId, setEditId] = useState<string>('');
    const [newSaleItem, setNewSaleItem] = useState<ISaleItem>();

    const handleEdit = async (saleItem: ISaleItem) => {
        setEditId(saleItem.id);
    }

    const handleCancel = async () => {
        setEditId('');
        setNewSaleItem(undefined);
    }

    const handleCreate = async () => {
        const newItem = await context.createSaleItem(context.sale_id);
        setNewSaleItem(newItem);
    }

    const handleInsert = async (saleItem: ISaleItem) => {
        const inserted = await context.insertSaleItem(saleItem);
        await handleCancel();
    }
    
    const handleDelete = async (saleItem: ISaleItem) => {
        const deleted = await context.deleteSaleItem(saleItem);
        await handleCancel();
    }

    const handleUpdate = async (saleItem: ISaleItem) => {
        const updated = await context.updateSaleItem(saleItem);
        await handleCancel();
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
                            <th>Item</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {context.saleItems?.map(saleItem => (
                            saleItem &&
                            <tr key={saleItem.id}>
                                {editId == saleItem.id &&
                                <td colSpan={5}>
                                    <EditSaleItem onSubmit={handleUpdate} allowDelete={true} data={saleItem} mode="update" onCancel={handleCancel} onDelete={handleDelete}></EditSaleItem>
                                </td>
                                
                                }

                                {editId !== saleItem.id &&
                                <>
                                    <td>
                                        {saleItem.item?.name}
                                    </td>
                                    <td>
                                        {saleItem.description}
                                    </td>
                                    <td>
                                        {saleItem.quantity}
                                    </td>
                                    <td>
                                        {saleItem.price}
                                    </td>
                                    <td>
                                        {saleItem.quantity * saleItem.price}
                                    </td>
                                    <td className="text-end">
                                        <Button variant="secondary" disabled={context.pending} onClick={(e: FormEvent<HTMLButtonElement>) => handleEdit(saleItem)}>
                                            <i className="bi-pencil"></i> Edit
                                        </Button>
                                    </td>
                                </>                                
                                }
                            </tr>

                        ))}                    
                        
                    </tbody>
                </table>
                <div>
                    {newSaleItem && <EditSaleItem onSubmit={handleInsert} allowDelete={false} data={newSaleItem} mode="create" onCancel={handleCancel}></EditSaleItem>}
                </div>
            </>
        </div>
    )
}

