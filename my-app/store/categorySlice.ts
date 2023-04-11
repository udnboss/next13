'use client';

import { createAsyncThunk, createSlice, configureStore, AnyAction } from '@reduxjs/toolkit'
import { ICategory, ICategoryQuery, IQuery, IQueryResult } from '../app/classes';
import { ClientUtil } from '../util';

export const getCategories = createAsyncThunk(
    'categories/getCategories',
    async (query: ICategoryQuery = null, thunkAPI) => {
        const params = query != null ? new URLSearchParams(Object.entries(query)).toString() : '';
        const result = await ClientUtil.get(`/api/categories?${params}`) as IQueryResult<ICategoryQuery, ICategory>;
        result.query = query;
        return result;
    }
)

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (category: ICategory, thunkAPI) => {
        const response =await ClientUtil.delete(`/api/categories/${category.id}`) as unknown as boolean;
        return response;
    }
)

// export const searchCategories = createAsyncThunk(
//     'categories/searchCategories',
//     async (query: ICategoryQuery, thunkAPI) => {
//         const params = query != null ? new URLSearchParams(Object.entries(query)).toString() : '';
//         const response = await ClientUtil.get(`/api/categories?${params}`) as unknown as ICategory[];
//         return response;
//     }
// )

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
    count: number;
    total: number;
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [] as ICategory[],
        selectedIndex: 0,
        selectedCategory: null as ICategory,
        query: null as ICategoryQuery,
        loading: 'idle',
        count: 0,
        total: 0
    } as categoriesStateType,
    reducers: {

    },
    extraReducers: (builder) => {       

        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload.result;
            state.query = action.payload.query;
            state.count = action.payload.count;
            state.total = action.payload.total;
            state.selectedCategory = state.categories[state.selectedIndex];
        })

        builder.addCase(getCategory.fulfilled, (state, action) => {
            state.selectedIndex = state.categories.findIndex(x => x.id == action.payload.id);
            state.categories[state.selectedIndex] = action.payload;
            state.selectedCategory = action.payload;
        })

        builder.addCase(getCategory.rejected, (state, action) => {
            state.selectedIndex = -1;
            state.selectedCategory = null;
        })

        //handle loading state (the order matters)
        builder.addMatcher((action: AnyAction) => { return (action.type as string).endsWith('pending');}, (state, action) => {
            state.loading = 'pending';
        });

        builder.addMatcher((action: AnyAction) => { return !(action.type as string).endsWith('pending');}, (state, action) => {
            state.loading = 'idle';
        });
    },
})


const store = configureStore({
    reducer: categoriesSlice.reducer
});

export default store;