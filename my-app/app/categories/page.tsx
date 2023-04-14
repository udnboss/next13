
'use client';

import { AnyAction } from "@reduxjs/toolkit";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, getCategories, categoriesStateType } from "../../store/categorySlice";
import { ICategory, ICategoryQuery } from "../classes"
import CategoriesListPage from "./list";

export default function CategoriesPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const categories = useSelector((state: categoriesStateType) => state.categories);
    const loading = useSelector((state: categoriesStateType) => state.loading);
    //const query = useSelector((state: categoriesStateType) => state.query);

    const dispatch = useDispatch();
    
    useEffect( () => {
        console.log('searchParams changed');
        const params = Object.fromEntries(searchParams?.entries() || []) as unknown as ICategoryQuery;
        dispatch(getCategories(params) as unknown as AnyAction);
        
    }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps
    
    const handleDelete = async (category:ICategory) => {
        dispatch(deleteCategory(category) as unknown as AnyAction);
    }

    const handleSearch = async (search:string) => {
        const params = new URLSearchParams(searchParams as unknown as URLSearchParams);
        params.set('search', search);
        router.push(pathname + '?' + params.toString());
        handleRefresh();            
    }

    const handleRefresh = async () => {
        const newQuery = Object.fromEntries(searchParams?.entries() || []) as unknown as ICategoryQuery;
        dispatch(getCategories(newQuery) as unknown as AnyAction);
    }

    const handleView = async (id:string) => {
        router.push(`/categories/${id}`);
    }

    const handleCreate = async () => {
        router.push(`/categories/create`);
    }

    const handleSort = async (sortby:string) => {
        const params = new URLSearchParams(searchParams as unknown as URLSearchParams);
        params.set('sortby', sortby);
        params.set('sortdir', 'asc');
        router.push(pathname + '?' + params.toString());
        handleRefresh();            
    }

    return (
        <div>
            <>
                <h2>Categories Page</h2>
                <CategoriesListPage categories={categories} loading={loading} 
                    onCreate={handleCreate} onDelete={handleDelete} onView={handleView} onSearch={handleSearch}
                    onRefresh={handleRefresh} onSort={handleSort}></CategoriesListPage>                
            </>
        </div>
    )
}

