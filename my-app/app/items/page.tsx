
'use client';

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import { IItem } from "../classes"
import { useItemsContext } from "./context";


export default function ItemsPage() {
    
    const context = useItemsContext();
    const [search, setSearch] = useState<string>('');

    
    const handleDelete = async (item:IItem) => {
        const deleted =  await context.deleteItem(item);        
        if(deleted) {
            context.getItems();
        }
    }

    const handleSearch = async (e) => {
        const search = e.target.value;
        setSearch(search);
        context.searchItems(search);
              
    }

    const handleRefresh = async () => {
        await context.getItems();
    }

    return (
        <div>
            <>
                <h2>Items Page</h2>
                <div className="text-end mb-3">
                    <Row>
                        <Col sm="6">
                            <FormControl type="text" placeholder="search" value={search} onChange={handleSearch}></FormControl>
                        </Col>
                        <Col>
                            <Link href={`/items/create`} className="btn btn-success me-2">
                                <i className="bi-plus-circle"></i> Add New Item
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
                                    pathname: '/items',
                                    query: { sortby: 'name', search:search, sortdir: context.query?.sortdir == 'desc' ? 'asc' : 'desc' },
                                }}>Name</Link>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {context.items?.map(item => (
                            <tr key={item.id}>
                                <td className="align-middle">
                                    <Link href={`/items/${item.id}`} className="text-decoration-none">{item.name}</Link>    
                                </td>
                                <td className="text-end">
                                    <Button variant="danger" disabled={context.pending} onClick={(e:FormEvent<HTMLButtonElement>) => handleDelete(item)}>
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

