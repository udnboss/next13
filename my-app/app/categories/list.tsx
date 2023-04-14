
'use client';

import { useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap";

export default function CategoriesListPage({categories, loading, onSearch, onRefresh, onCreate, onDelete, onView, onSort}) {
    
    const [search, setSearch] = useState<string>('');
    
    const handleSearch = async (e) => {
        const search = e.target.value;
        setSearch(search);   
        onSearch(search);     
    }

    const handleRefresh = async () => {
        onRefresh();
    }

    const handleSort = async (sortby:string) => {
        onSort(sortby);
    }

    const handleCreate = async () => {
        onCreate();
    }

    const handleView = async (id:string) => {
        onView(id);
    }

    const handleDelete = async (id:string) => {
        onDelete(id);
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
                                <i className="bi-plus-circle"></i> Add New Category
                            </Button> 
                            <Button onClick={handleRefresh}>
                            <i className="bi-arrow-repeat"></i> Refresh
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
                        {categories?.map(category => (
                            <tr key={category.id}>
                                <td className="align-middle">
                                    <a href="#" onClick={(e) => {e.preventDefault(); handleView(category.id)}} className="text-decoration-none">{category.name}</a>    
                                </td>
                                <td className="text-end">
                                    <Button variant="danger" disabled={loading !== 'idle'} onClick={(e) => handleDelete(category.id)}>
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

