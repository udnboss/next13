import { SalesProvider } from "./context";

export default function SalesLayout({ children }) {
    return (
        <SalesProvider>
            {children}    
        </SalesProvider>               
    )
}