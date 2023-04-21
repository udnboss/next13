'use client';

import { useEffect, useState } from "react";
import { ICompany } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditCompany } from "../edit";
import { useCompaniesContext } from "../context";



export default function CompanyPage({params}){
    const router = useRouter();
    const context = useCompaniesContext();
    const [company, setCompany] = useState<ICompany>();

    useEffect(() => {
        async function fetchData(id:string) {
            setCompany(await context.getCompany(id));
        }

        fetchData(params.id);
    }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (company:ICompany) => {
        const updated = await context.updateCompany(company);
        router.push('/companies');
    }

    const handleDelete = async (company:ICompany) => {
        const deleted = await context.deleteCompany(company);        
        if(deleted) {
            await context.getCompanies();
        }
    }

    return ( company &&
        <EditCompany data={company} disabled={false} onSubmit={handleSubmit} mode="update" allowDelete={true} onDelete={handleDelete}></EditCompany>
    );
}