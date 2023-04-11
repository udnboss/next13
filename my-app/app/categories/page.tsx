
'use client';

import { AnyAction } from "@reduxjs/toolkit";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, getCategories, categoriesStateType } from "../../store/categorySlice";
import { ICategory, ICategoryQuery } from "../classes"

export default function CategoriesPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const categories = useSelector((state: categoriesStateType) => state.categories);
    const loading = useSelector((state: categoriesStateType) => state.loading);
    const query = useSelector((state: categoriesStateType) => state.query);

    const dispatch = useDispatch();
    
    const [search, setSearch] = useState<string>('');

    useEffect( () => {
        console.log('searchParams changed');
        const params = Object.fromEntries(searchParams.entries()) as unknown as ICategoryQuery;
        dispatch(getCategories(params) as unknown as AnyAction);
        
    }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps
    
    const handleDelete = async (category:ICategory) => {
        dispatch(deleteCategory(category) as unknown as AnyAction);
    }

    const handleSearch = async (e) => {
        const search = e.target.value;
        setSearch(search);
        const params = new URLSearchParams(searchParams as unknown as URLSearchParams);
        params.set('search', search);
        router.push(pathname + '?' + params.toString());
        handleRefresh();            
    }

    const handleRefresh = async () => {
        const newQuery = Object.fromEntries(searchParams.entries()) as unknown as ICategoryQuery;
        dispatch(getCategories(newQuery) as unknown as AnyAction);
    }

    return (
        <div>
            <>
                <h2>Categories Page</h2>
                <div className="text-end mb-3">
                    <Row>
                        <Col sm="6">
                            <FormControl type="text" placeholder="search" value={search} onChange={handleSearch}></FormControl>
                        </Col>
                        <Col>
                            <Link href={`/categories/create`} className="btn btn-success me-2">
                                <i className="bi-plus-circle"></i> Add New Category
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
                                    pathname: '/categories',
                                    query: { sortby: 'name', search:search, sortdir: query?.sortdir == 'desc' ? 'asc' : 'desc' },
                                }}>Name</Link>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.map(category => (
                            <tr key={category.id}>
                                <td className="align-middle">
                                    <Link href={`/categories/${category.id}`} className="text-decoration-none">{category.name}</Link>    
                                </td>
                                <td className="text-end">
                                    <Button variant="danger" disabled={loading !== 'idle'} onClick={(e:FormEvent<HTMLButtonElement>) => handleDelete(category)}>
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

