'use client';

import { useEffect, useState } from "react";
import { ICustomer } from "../../../app/classes";

// import { useRouter } from 'next/navigation';
import { useRouter } from 'next/router'
import EditCustomer from "../edit";

import { ClientUtil } from "../../../util";
import CustomersLayout from "../layout";

function getCleanCopy(data:ICustomer) {
    const cleanData = {...data};
    delete data.currency;
    delete data.sales;
    return cleanData;
}

async function getCustomer(id:string) {
    return await ClientUtil.get(`/api/customers/${id}`) as unknown as ICustomer;
}

async function updateCustomer(customer:ICustomer) {
    return await ClientUtil.put(`/api/customers`, getCleanCopy(customer)) as unknown as ICustomer;
}

async function deleteCustomer(id:string) {
    return await ClientUtil.delete(`/api/customers/${id}`) as unknown as boolean;
}

export default function CustomerPage({params}){        
    const router = useRouter();    
    
    const [customer, setCustomer] = useState<ICustomer>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect( () => {
        const fetchData = async () => {
            const customer = await getCustomer(router.query.id as string) as unknown as ICustomer;
            // console.log(customer);
            setCustomer(customer);        
        }

        if(router.query.id !== undefined)
            fetchData();    
    }, [router.query]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (customer:ICustomer) => {
        setLoading(true);
        await updateCustomer(customer);
        setLoading(false);
        router.push('/customers');
    }

    const handleDelete = async (customer:ICustomer) => {
        setLoading(true);
        await deleteCustomer(customer.id);
        setLoading(false);
        router.push('/customers');
    }

    const handleCancel = async () => {
        router.push('/customers');
    }

    
    return ( 
        <>
        <CustomersLayout>
        {customer &&
            
            <EditCustomer data={customer} 
            onSubmit={handleSubmit} mode="update" allowDelete={true} onDelete={handleDelete} onCancel={handleCancel}></EditCustomer>
        }    
        </CustomersLayout>         
        </>
        
    );
       
    
    
}