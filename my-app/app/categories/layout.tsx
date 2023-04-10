'use client';
import { Provider } from "react-redux";
import store from "../../store/categorySlice";


export default function CategoriesLayout({ children }) {
    return (
        <Provider store={store}>
            {children}    
        </Provider>               
    )
}