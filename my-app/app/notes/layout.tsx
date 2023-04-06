import { NotesProvider } from "./NotesContext";

export default function NotesLayout({ children }) {
    return (
        <NotesProvider>
            {children}
        </NotesProvider>
    )

}