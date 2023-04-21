'use client';

import { useState } from "react";
import { ICompany } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditCompany } from "../edit";
import { useCompaniesContext } from "../context";

export default function CreateCompanyPage({params}){
    const router = useRouter();
    const context = useCompaniesContext();
    const [company, setCompany] = useState<ICompany>(params ??= {id: '', name: ''} as ICompany);

    const handleSubmit = async (company:ICompany) => {
        const inserted = await context.insertCompany(company);
        router.push('/companies');
    }

    return (company &&
        <EditCompany data={company} disabled={false} onSubmit={handleSubmit} mode="create" allowDelete={false} ></EditCompany>
    );
}