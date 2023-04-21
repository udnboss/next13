import { CompaniesProvider } from "./context";

export default function CompaniesLayout({ children }) {
    return (
        <CompaniesProvider>
            {children}    
        </CompaniesProvider>               
    )
}