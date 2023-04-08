import { ItemsProvider } from "./context";

export default function ItemsLayout({ children }) {
    return (
        <ItemsProvider>
            {children}    
        </ItemsProvider>               
    )
}