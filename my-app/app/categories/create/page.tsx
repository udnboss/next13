'use client';

import { useState } from "react";
import { ICategory } from "../../classes";

import { useRouter } from 'next/navigation';
import { EditCategory } from "../edit";
import { useDispatch } from "react-redux";
import { insertCategory } from "../../../store/categorySlice";
import { AnyAction } from "@reduxjs/toolkit";


export default function CreateCategoryPage({params}){
    const router = useRouter();
    const dispatch = useDispatch();
    
    const [category, setCategory] = useState<ICategory>(params ??= {id: '', name: ''} as ICategory);

    const handleSubmit = async (category:ICategory) => {
        dispatch(insertCategory(category)  as unknown as AnyAction);
        router.push('/categories');
    }

    return (category &&
        <EditCategory data={category} disabled={false} onSubmit={handleSubmit} mode="create" allowDelete={false} ></EditCategory>
    );
}