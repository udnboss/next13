'use client';

import CreateNote from "./CreateNote";
import { useNotesContext } from "./NotesContext";
import Link from "next/link";

export default function NotesPage() {
    const context = useNotesContext()
    return (
            <>
                <div>
                    <h2>Notes Page {context.notes.length}</h2>
                    {context.notes.map(note => {
                        return <Note key={note.id} thenote={note} />;
                    })}
                </div>
                <CreateNote></CreateNote>
            </>
    )
}

function Note({ thenote }) {
    const { id, note } = thenote || {};

    return (
        <Link href={`/notes/${id}`}>
            <p>{note}</p>
        </Link>
    )
}