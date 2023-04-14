
'use client';

import { useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ClientUtil } from "../../util";

export default function CustomersListPage({customers}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [search, setSearch] = useState<string>('');
    
    const handleSearch = async (e) => {
        const search = e.target.value;
        setSearch(search);   
        const params = new URLSearchParams(searchParams as unknown as URLSearchParams);
        params.set('search', search);
        router.push('/customers?' + params.toString());    
    }

    const handleSort = async (sortby:string) => {
        const params = new URLSearchParams(searchParams as unknown as URLSearchParams);
        params.set('sortby', sortby);
        params.set('sortdir', 'asc');
        router.push('/customers?' + params.toString()); 
    }

    const handleCreate = async () => {
        router.push(`/customers/create`);
    }

    return (
        <div>
            <>
                <div className="text-end mb-3">
                    <Row>
                        <Col sm="6">
                            <FormControl type="text" placeholder="search" value={search} onChange={handleSearch}></FormControl>
                        </Col>
                        <Col>
                            <Button onClick={handleCreate} variant="success" className="me-2">
                                <i className="bi-plus-circle"></i> Add New Customer
                            </Button> 
                        </Col>
                    </Row>
                </div>
                
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                <a href="#" onClick={(e) => {e.preventDefault(); handleSort('name');}}>Name</a>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers?.map(customer => (
                            <tr key={customer.id}>
                                <td className="align-middle">
                                    <Link href={`/customers/${customer.id}`} className="text-decoration-none">{customer.name}</Link>    
                                </td>
                            </tr>
                        ))}    
                    </tbody>
                </table>
            </>
        </div>
    )
}

