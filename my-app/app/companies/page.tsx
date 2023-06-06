
'use client';

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import { ICompany } from "../classes"
import { useCompaniesContext } from "./context";
import { useRouter } from "next/navigation";


export default function CompaniesPage() {
    const router = useRouter();
    const context = useCompaniesContext();
    const [search, setSearch] = useState<string>('');

    
    const handleDelete = async (company:ICompany) => {
        const deleted =  await context.deleteCompany(company);        
        if(deleted) {
            context.getCompanies();
        }
    }

    const handleEdit = async (company:ICompany) => {
        router.push(`/companies/${company.id}`);
    }

    const handleDuplicate = async (company:ICompany) => {
        const copyCompany = {...company} as ICompany;
        const newCompany = await context.createCompany();
        copyCompany.id = newCompany.id;
        const inserted = await context.insertCompany(copyCompany);
        router.push(`/companies/${inserted.id}`);
    }

    const handleSearch = async (e) => {
        const search = e.target.value;
        setSearch(search);
        context.searchCompanies(search);              
    }

    const handleRefresh = async () => {
        await context.getCompanies();
    }

    return (
        <div>
            <>
                <h2>Companies Page</h2>
                <div className="text-end mb-3">
                    <Row>
                        <Col sm="6">
                            <FormControl type="text" placeholder="search" value={search} onChange={handleSearch}></FormControl>
                        </Col>
                        <Col>
                            <Link href={`/companies/create`} className="btn btn-success me-2">
                                <i className="bi-plus-circle"></i> Add New Company
                            </Link> 
                            <Button onClick={handleRefresh}>
                            <i className="bi-arrow-repeat"></i> Refresh
                            </Button>
                        </Col>
                    </Row>
                </div>
                
                <table className="table">
                    <thead>
                        <tr>
                            <th><Link href={{
                                    pathname: '/companies',
                                    query: { sortby: 'name', search:search, sortdir: context.query?.sortdir == 'desc' ? 'asc' : 'desc' },
                                }}>Name</Link>
                            </th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {context.companies?.map(company => (
                            company &&
                            <tr key={company.id}>
                                <td>{company.name}</td>
                                <td>{company.contact}</td>
                                <td>{company.email}</td>
                                                                    
                                <td className="text-end">
                                    <Button variant="secondary" onClick={(e:FormEvent<HTMLButtonElement>) => handleEdit(company)}>
                                        <i className="bi-pencil"></i>
                                    </Button>
                                    <Button className="ms-2" variant="secondary" onClick={(e:FormEvent<HTMLButtonElement>) => handleDuplicate(company)}>
                                        <i className="bi-files"></i>
                                    </Button>
                                </td>
                            </tr>
                            
                        ))}    
                    </tbody>
                </table>
            </>
        </div>
    )
}

