
'use client';

import Link from "next/link";
import { FormEvent } from "react";
import { Button } from "react-bootstrap";
import { IItem } from "../classes"
import { useItemsContext } from "./context";


export default function ItemsPage() {
    const context = useItemsContext();
    
    const handleDelete = async (item:IItem) => {
        const deleted =  await context.deleteItem(item);        
        if(deleted) {
            context.getItems();
        }
    }

    // const handleCreate = async (item:IItem) => {
    //     const inserted = await context.insertItem(item);
    //     context.getItems();
    // }

    const handleRefresh = async () => {
        await context.getItems();
    }

    return (
        <div>
            <>
                <h2>Items Page</h2>
                <div className="text-end">
                    <Link href={`/items/create`} className="btn btn-success me-2">
                        <i className="bi-plus-circle"></i> Add New Item
                    </Link> 
                    <Button onClick={handleRefresh}>
                       <i className="bi-arrow-repeat"></i> Refresh
                    </Button>
                </div>
                
                <table className="table">
                    <thead>
                        <tr>
                            <th><Link href={{
                                    pathname: '/items',
                                    query: { sortby: 'name', sortdir: context.query?.sortdir == 'desc' ? 'asc' : 'desc' },
                                }}>Name</Link>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {context.items?.map(item => (
                            <tr key={item.id}>
                                <td className="align-middle">
                                    <Link href={`/items/${item.id}`} className="text-decoration-none">{item.name}</Link>    
                                </td>
                                <td className="text-end">
                                    <Button variant="danger" disabled={context.pending} onClick={(e:FormEvent<HTMLButtonElement>) => handleDelete(item)}>
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

