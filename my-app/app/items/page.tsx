
'use client';

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Util } from "../../util";
import { IItem } from "../classes"

async function getData() {
    const json = await Util.get('/api/items') as unknown;
    return json as IItem[];
}

async function insertData(item) {
    const json = Util.post('/api/items', item) as unknown;
    return json as IItem;
}

async function deleteData(item) {
    return Util.delete(`/api/items/delete/${item.id}`) as unknown as IItem;
}

export default function ItemsPage() {
    const [pending, setPending] = useState<boolean>(false);
    const [items, setItems] = useState<IItem[]>();

    useEffect( () => {
        async function fetchData () {
            const it = await getData();
            setItems(it);
        };
        fetchData();
    }, [])
    
    const handleDelete = async (item:IItem) => {
        setPending(true);
        await deleteData(item);        
        
        setPending(false);
    }

    return (
        <div>
            <>
                <h2>Items Page</h2>
                {items?.map(item => (
                    <div key={item.id}>
                        <Link href={`/items/${item.id}`}>{item.name}</Link>
                        <button disabled={pending} onClick={(e:FormEvent<HTMLButtonElement>) => handleDelete(item)}>Delete</button>
                    </div>
                ))}
                <CreateItem></CreateItem>
            </>
        </div>
    )
}

export function CreateItem() {
    const [item, setItem] = useState<IItem>({ id: '', name: '' } as IItem);

    const handleForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setItem({
            ...item,
            [e.currentTarget.id]: e.currentTarget.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const inserted = await insertData(item);
        setItem(inserted);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input id="id" placeholder="id" value={item.id} onChange={handleForm} />
            <textarea id="name" placeholder="name" value={item.name} onChange={handleForm} />
            <button type="submit">Create</button>
        </form>
    );
}