import { CurrenciesProvider } from "./context";

export default function CurrenciesLayout({ children }) {
    return (
        <CurrenciesProvider>
            {children}    
        </CurrenciesProvider>               
    )
}