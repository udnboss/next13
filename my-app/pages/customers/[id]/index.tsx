'use client';

import { useEffect, useState } from "react";
import { ICurrency, ICustomer, IQuery, IQueryResult } from "../../../app/classes";

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

async function getCurrencies() {
    return await ClientUtil.get(`/api/currencies`).then((result:IQueryResult<IQuery, ICurrency>) => result.result);
}

export default function CustomerPage({params}){        
    const router = useRouter();    
    
    const [customer, setCustomer] = useState<ICustomer>();
    const [loading, setLoading] = useState<boolean>(false);
    const [currencies, setCurrencies] = useState([]);
    

    useEffect( () => {
        const fetchData = async () => {
            const customer = await getCustomer(router.query.id as string) as unknown as ICustomer;
            // console.log(customer);
            setCustomer(customer);   
            const currencies = await getCurrencies() as never[];
            setCurrencies(currencies);     
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
            
            <EditCustomer data={customer} currencies={currencies}
            onSubmit={handleSubmit} mode="update" allowDelete={true} onDelete={handleDelete} onCancel={handleCancel}></EditCustomer>
        }    
        </CustomersLayout>         
        </>
        
    );
       
    
    
}