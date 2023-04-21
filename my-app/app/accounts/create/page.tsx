'use client';

import { useState } from "react";
import { IAccount } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditAccount } from "../edit";
import { useAccountsContext } from "../context";

export default function CreateAccountPage({params}){
    const router = useRouter();
    const context = useAccountsContext();
    const [account, setAccount] = useState<IAccount>(params ??= {id: '', label: ''} as IAccount);

    const handleSubmit = async (account:IAccount) => {
        const inserted = await context.insertAccount(account);
        router.push('/accounts');
    }

    return (account &&
        <EditAccount data={account} disabled={false} onSubmit={handleSubmit} mode="create" allowDelete={false} ></EditAccount>
    );
}