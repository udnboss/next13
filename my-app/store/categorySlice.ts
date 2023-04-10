'use client';

import { createAsyncThunk, createSlice, configureStore } from '@reduxjs/toolkit'
import { ICategory, ICategoryQuery } from '../app/classes';
import { ClientUtil } from '../util';

export const getCategories = createAsyncThunk(
    'categories/getCategories',
    async (query: ICategoryQuery = null, thunkAPI) => {
        const params = query != null ? new URLSearchParams(Object.entries(query)).toString() : '';
        const response = await ClientUtil.get(`/api/categories?${params}`) as unknown as ICategory[];
        return response;
    }
)

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (category: ICategory, thunkAPI) => {
        const response =await ClientUtil.delete(`/api/categories/${category.id}`) as unknown as boolean;
        return response;
    }
)

export const searchCategories = createAsyncThunk(
    'categories/searchCategories',
    async (params: string = '', thunkAPI) => {
        const response = await ClientUtil.get(`/api/categories?${params}`) as unknown as ICategory[];
        return response;
    }
)

export const getCategory = createAsyncThunk(
    'categories/getCategory',
    async (id: string = '', thunkAPI) => {
        const response = await ClientUtil.get(`/api/categories/${id}`) as unknown as ICategory;
        return response;
    }
)

export const insertCategory = createAsyncThunk(
    'categories/insertCategory',
    async (category: ICategory, thunkAPI) => {
        const response = await ClientUtil.post('/api/categories', category) as unknown as ICategory;
        return response;
    }
)

export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async (category: ICategory, thunkAPI) => {
        const response = await ClientUtil.put(`/api/categories`, category) as unknown as ICategory; 
        return response;
    }
)

export type categoriesStateType = {
    categories: ICategory[];
    selectedIndex: number;
    selectedCategory: ICategory;
    query: ICategoryQuery;
    loading: string;
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [] as ICategory[],
        selectedIndex: 0,
        selectedCategory: null as ICategory,
        query: null as ICategoryQuery,
        loading: 'idle'
    } as categoriesStateType,
    reducers: {

    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(getCategories.fulfilled, (state, action) => {
            // update the state array
            state.categories = action.payload;
        })

        builder.addCase(getCategory.fulfilled, (state, action) => {
            // update the state
            state.selectedIndex = state.categories.findIndex(x => x.id == action.payload.id);
            state.selectedCategory = state.categories[state.selectedIndex];
        })
    },
})


const store = configureStore({
    reducer: categoriesSlice.reducer
});

export default store;