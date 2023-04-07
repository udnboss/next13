
'use client';

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { ClientUtil } from "../../util";
import { IItem } from "../classes"
import { CreateItem } from "./create";


async function getData() {
    const json = await ClientUtil.get('/api/items') as unknown;
    return json as IItem[];
}

async function insertData(item:IItem) {
    const json = ClientUtil.post('/api/items', item) as unknown;
    return json as IItem;
}

async function deleteData(item:IItem) {
    return ClientUtil.delete(`/api/items/${item.id}`) as unknown as boolean;
}

export default function ItemsPage() {
    const [pending, setPending] = useState<boolean>(false);
    const [items, setItems] = useState<IItem[]>();

    useEffect( () => {
        async function fetchData () {
            setItems(await getData());
        };
        fetchData();
    }, [])
    
    const handleDelete = async (item:IItem) => {
        setPending(true);
        const deleted = await deleteData(item);        
        if(deleted) {
            setItems(await getData());
        }
        setPending(false);
    }

    const handleCreate = async (item:IItem) => {
        setPending(true);
        const inserted = await insertData(item);
        setItems(await getData());
        setPending(false);
    }

    return (
        <div>
            <>
                <h2>Items Page</h2>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items?.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <Link href={`/items/${item.id}`}>{item.name}</Link>    
                                </td>
                                <td>
                                    <Button variant="danger" disabled={pending} onClick={(e:FormEvent<HTMLButtonElement>) => handleDelete(item)}>
                                        <i className="bi-trash"></i> Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}    
                    </tbody>
                </table>

                <CreateItem disabled={pending} onSubmit={handleCreate}></CreateItem>
            </>
        </div>
    )
}

