'use client';

import { useNotesContext } from "../NotesContext"

export default function NotePage({params}){
    const notesContext = useNotesContext();
    const note = notesContext.notes.filter(n => n.id == params.id)[0];
    return (
        <div>
            <h2>Single Note Page: {note.id}</h2>
            <p>{note.note}</p>
        </div>
    )
}