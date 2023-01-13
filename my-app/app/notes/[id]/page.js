import { NotesContext } from "@/app/NotesContext"
import { useContext } from "react"

export default function NotePage({params}){
    const [context, setContext] = useContext(NotesContext);
    const note = context.notes.filter(n => n.id == params.id)[0];
    return (
        <div>
            <h2>Single Note Page: {note.id}</h2>
            <p>{note.note}</p>
        </div>
    )
}