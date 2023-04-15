
'use client';

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import { ISale } from "../classes"
import { useSalesContext } from "./context";


export default function SalesPage() {
    
    const context = useSalesContext();
    const [search, setSearch] = useState<string>('');

    
    const handleDelete = async (sale:ISale) => {
        const deleted =  await context.deleteSale(sale);        
        if(deleted) {
            context.getSales();
        }
    }

    const handleSearch = async (e) => {
        const search = e.target.value;
        setSearch(search);
        context.searchSales(search);
              
    }

    const handleRefresh = async () => {
        await context.getSales();
    }

    return (
        <div>
            <>
                <h2>Sales Page</h2>
                <div className="text-end mb-3">
                    <Row>
                        <Col sm="6">
                            <FormControl type="text" placeholder="search" value={search} onChange={handleSearch}></FormControl>
                        </Col>
                        <Col>
                            <Link href={`/sales/create`} className="btn btn-success me-2">
                                <i className="bi-plus-circle"></i> Add New Sale
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
                                    pathname: '/sales',
                                    query: { sortby: 'number', search:search, sortdir: context.query?.sortdir == 'desc' ? 'asc' : 'desc' },
                                }}>Name</Link>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {context.sales?.map(sale => (
                            sale &&
                            <tr key={sale.id}>
                                <td className="align-middle">
                                    <Link href={`/sales/${sale.id}`} className="text-decoration-none">{sale.number}</Link>    
                                </td>
                                <td className="text-end">
                                    <Button variant="danger" disabled={context.pending} onClick={(e:FormEvent<HTMLButtonElement>) => handleDelete(sale)}>
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

