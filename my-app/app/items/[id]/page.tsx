'use client';

import { useEffect, useState } from "react";
import { IItem } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditItem } from "../edit";
import { useItemsContext } from "../context";



export default function ItemPage({params}){
    const router = useRouter();
    const context = useItemsContext();
    const [item, setItem] = useState<IItem>();

    useEffect(() => {
        async function fetchData(id:string) {
            setItem(await context.getItem(id));
        }

        fetchData(params.id);
    }, [params.id]);

    const handleSubmit = async (item:IItem) => {
        const updated = await context.updateItem(item);
        router.push('/items');
    }

    const handleDelete = async (item:IItem) => {
        const deleted = await context.deleteItem(item);        
        if(deleted) {
            await context.getItems();
        }
    }

    return ( item &&
        <EditItem data={item} disabled={false} onSubmit={handleSubmit} mode="update" allowDelete={true} onDelete={handleDelete}></EditItem>
    );
}