'use client';

import { useEffect, useState } from "react";
import { IAccount } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditAccount } from "../edit";
import { useAccountsContext } from "../context";



export default function AccountPage({params}){
    const router = useRouter();
    const context = useAccountsContext();
    const [account, setAccount] = useState<IAccount>();

    useEffect(() => {
        async function fetchData(id:string) {
            setAccount(await context.getAccount(id));
        }

        fetchData(params.id);
    }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (account:IAccount) => {
        const updated = await context.updateAccount(account);
        router.push('/accounts');
    }

    const handleDelete = async (account:IAccount) => {
        const deleted = await context.deleteAccount(account);        
        if(deleted) {
            await context.getAccounts();
        }
    }

    return ( account &&
        <EditAccount data={account} disabled={false} onSubmit={handleSubmit} mode="update" allowDelete={true} onDelete={handleDelete}></EditAccount>
    );
}