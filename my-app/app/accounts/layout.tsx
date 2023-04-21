import { AccountsProvider } from "./context";

export default function AccountsLayout({ children }) {
    return (
        <AccountsProvider>
            {children}    
        </AccountsProvider>               
    )
}