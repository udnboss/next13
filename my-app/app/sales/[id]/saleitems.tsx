
'use client';

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import { ISaleItem } from "../../classes"
import { useSaleItemsContext } from "./context";


export default function SaleItemsPage() {

    const context = useSaleItemsContext();

    const handleDelete = async (saleItem: ISaleItem) => {
        const deleted = await context.deleteSaleItem(saleItem);
    }

    return (
        <div>
            <>
                <h2>SaleItems Page</h2>
                <div className="text-end mb-3">

                    <Link href={`/saleItems/create`} className="btn btn-success me-2">
                        <i className="bi-plus-circle"></i> Add New SaleItem
                    </Link>

                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {context.saleItems?.map(saleItem => (
                            saleItem &&
                            <tr key={saleItem.id}>
                                <td>
                                    {saleItem.item_id}
                                </td>
                                <td className="text-end">
                                    <Button variant="danger" disabled={context.pending} onClick={(e: FormEvent<HTMLButtonElement>) => handleDelete(saleItem)}>
                                        <i className="bi-trash"></i> Delete
                                    </Button>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </>
        </div>
    )
}

