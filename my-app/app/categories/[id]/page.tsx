'use client';

import { useEffect, useState } from "react";
import { ICategory } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditCategory } from "../edit";
import { useDispatch, useSelector } from "react-redux";
import { categoriesStateType, deleteCategory, getCategory, updateCategory } from "../../../store/categorySlice";
import { AnyAction } from "@reduxjs/toolkit";

export default function CategoryPage({params}){
    const selectedCategory = useSelector((state: categoriesStateType) => state.selectedCategory);
    const loading = useSelector((state: categoriesStateType) => state.loading);
    const router = useRouter();
    const dispatch = useDispatch();
    
    const [category, setCategory] = useState<ICategory>();

    useEffect( () => {
        dispatch(getCategory(params.id) as unknown as AnyAction);        
    }, [params.id]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setCategory(selectedCategory);
        if(selectedCategory === null) {
            // router.push('/404');
            //notFound();
        }

        // console.log(selectedCategory);
    }, [selectedCategory, loading]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (category:ICategory) => {
        dispatch(updateCategory(category) as unknown as AnyAction);
        router.push('/categories');
    }

    const handleDelete = async (category:ICategory) => {
        dispatch(deleteCategory(category) as unknown as AnyAction);
    }

    if(category) {
        return ( 
            <EditCategory data={category} disabled={loading != 'idle'} onSubmit={handleSubmit} mode="update" allowDelete={true} onDelete={handleDelete}></EditCategory>
        );
    }   
    
    
}