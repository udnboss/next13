'use client';

import { useState } from "react";
import { IItem } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditItem } from "../edit";
import { useItemsContext } from "../context";

export default function CreateItemPage({params}){
    const router = useRouter();
    const context = useItemsContext();
    const [item, setItem] = useState<IItem>(params ??= {id: '', name: ''} as IItem);

    const handleSubmit = async (item:IItem) => {
        const inserted = await context.insertItem(item);
        router.push('/items');
    }

    return (item &&
        <EditItem data={item} disabled={false} onSubmit={handleSubmit} mode="create" allowDelete={false} ></EditItem>
    );
}