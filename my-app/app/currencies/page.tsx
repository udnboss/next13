
'use client';

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import { ICurrency } from "../classes"
import { useCurrenciesContext } from "./context";


export default function CurrenciesPage() {
    
    const context = useCurrenciesContext();
    const [search, setSearch] = useState<string>('');

    
    const handleDelete = async (currency:ICurrency) => {
        const deleted =  await context.deleteCurrency(currency);        
        if(deleted) {
            context.getCurrencies();
        }
    }

    const handleSearch = async (e) => {
        const search = e.target.value;
        setSearch(search);
        context.searchCurrencies(search);
              
    }

    const handleRefresh = async () => {
        await context.getCurrencies();
    }

    return (
        <div>
            <>
                <h2>Currencies Page</h2>
                <div className="text-end mb-3">
                    <Row>
                        <Col sm="6">
                            <FormControl type="text" placeholder="search" value={search} onChange={handleSearch}></FormControl>
                        </Col>
                        <Col>
                            <Link href={`/currencies/create`} className="btn btn-success me-2">
                                <i className="bi-plus-circle"></i> Add New Currency
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
                                    pathname: '/currencies',
                                    query: { sortby: 'name', search:search, sortdir: context.query?.sortdir == 'desc' ? 'asc' : 'desc' },
                                }}>Name</Link>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {context.currencies?.map(currency => (
                            currency &&
                            <tr key={currency.id}>
                                <td className="align-middle">
                                    <Link href={`/currencies/${currency.id}`} className="text-decoration-none">{currency.name}</Link>    
                                </td>
                                <td className="text-end">
                                    <Button variant="danger" disabled={context.pending} onClick={(e:FormEvent<HTMLButtonElement>) => handleDelete(currency)}>
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

