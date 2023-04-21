'use client';

import { useState } from "react";
import { ICustomer } from "../../app/classes";

import { useRouter } from 'next/navigation';
import  EditCustomer from "./edit";
import { ClientUtil } from "../../util";
import CustomersLayout from "./layout";

function getCleanCopy(data:ICustomer) {
    const cleanData = {...data};
    delete data.currency;
    delete data.sales;
    return cleanData;
}

async function insertCustomer(customer:ICustomer) {
    return await ClientUtil.post(`/api/customers`, getCleanCopy(customer)) as unknown as ICustomer;
}

export default function CreateCustomerPage({params}){
    const router = useRouter();
    
    const [customer, setCustomer] = useState<ICustomer>(params ??= {id: '', name: ''} as ICustomer);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (customer:ICustomer) => {
        setLoading(true);
        await insertCustomer(customer);
        setLoading(false);
        router.push('/customers');
    }

    const handleCancel = async () => {
        router.push('/customers');
    }

    return (
        <CustomersLayout>
            {customer &&
            <EditCustomer data={customer} onSubmit={handleSubmit} onCancel={handleCancel} mode="create" allowDelete={false} ></EditCustomer>
            }    
        </CustomersLayout>
        
    );
}