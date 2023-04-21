
'use client';

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import { IAccount } from "../classes"
import { useAccountsContext } from "./context";


export default function AccountsPage() {
    
    const context = useAccountsContext();
    const [search, setSearch] = useState<string>('');

    
    const handleDelete = async (account:IAccount) => {
        const deleted =  await context.deleteAccount(account);        
        if(deleted) {
            context.getAccounts();
        }
    }

    const handleSearch = async (e) => {
        const search = e.target.value;
        setSearch(search);
        context.searchAccounts(search);
              
    }

    const handleRefresh = async () => {
        await context.getAccounts();
    }

    return (
        <div>
            <>
                <h2>Accounts Page</h2>
                <div className="text-end mb-3">
                    <Row>
                        <Col sm="6">
                            <FormControl type="text" placeholder="search" value={search} onChange={handleSearch}></FormControl>
                        </Col>
                        <Col>
                            <Link href={`/accounts/create`} className="btn btn-success me-2">
                                <i className="bi-plus-circle"></i> Add New Account
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
                                    pathname: '/accounts',
                                    query: { sortby: 'name', search:search, sortdir: context.query?.sortdir == 'desc' ? 'asc' : 'desc' },
                                }}>Name</Link>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {context.accounts?.map(account => (
                            account &&
                            <tr key={account.id}>
                                <td className="align-middle">
                                    <Link href={`/accounts/${account.id}`} className="text-decoration-none">{account.label}</Link>    
                                </td>
                                <td className="text-end">
                                    <Button variant="danger" disabled={context.pending} onClick={(e:FormEvent<HTMLButtonElement>) => handleDelete(account)}>
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

