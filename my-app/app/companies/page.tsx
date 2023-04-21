
'use client';

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import { ICompany } from "../classes"
import { useCompaniesContext } from "./context";


export default function CompaniesPage() {
    
    const context = useCompaniesContext();
    const [search, setSearch] = useState<string>('');

    
    const handleDelete = async (company:ICompany) => {
        const deleted =  await context.deleteCompany(company);        
        if(deleted) {
            context.getCompanies();
        }
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {context.companies?.map(company => (
                            company &&
                            <tr key={company.id}>
                                <td className="align-middle">
                                    <Link href={`/companies/${company.id}`} className="text-decoration-none">{company.name}</Link>    
                                </td>
                                <td className="text-end">
                                    <Button variant="danger" disabled={context.pending} onClick={(e:FormEvent<HTMLButtonElement>) => handleDelete(company)}>
                                        <i className="bi-trash"></i> Delete
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

