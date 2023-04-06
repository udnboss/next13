'use client';

import { useEffect, useState } from "react";
import { Util } from "../../../util";
import { IItem } from "../../classes";

async function getData(id:string) {
    const json = await Util.get(`/api/items/${id}`) as unknown; 
    return json as IItem;
}

async function updateData(item) {
    const json = Util.put(`/api/items`, item) as unknown; 
    return json as IItem;
}

export default function ItemPage({params}){
    const [item, setItem] = useState<IItem>();

    useEffect(() => {
        async function fetchData(id) {
            setItem(await getData(id));
        }

        fetchData(params.id);
    }, [params.id]);

    const handleForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setItem({
            ...item,
            [e.currentTarget.id]: e.currentTarget.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updated = await updateData(item);
        setItem(updated);
    }

    return ( item &&
        <form onSubmit={handleSubmit}>
            <input disabled={true} value={item.id} />
            <textarea id="name" placeholder="name" value={item.name} onChange={handleForm} />
            <button type="submit">Update</button>
        </form>
    );
}