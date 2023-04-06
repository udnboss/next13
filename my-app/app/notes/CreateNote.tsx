'use client';

import { useState } from "react";
import { useNotesContext, INote } from "./NotesContext";

export default function CreateNote() {
    const [note, setNote] = useState<INote>({id: '', note: ''} as INote);

    const context = useNotesContext();

    const handleForm = (e: React.FormEvent<HTMLInputElement|HTMLTextAreaElement>): void => {
        setNote({
          ...note,
          [e.currentTarget.id]: e.currentTarget.value,
        });
      };

    const create = (e: React.FormEvent) => {
        e.preventDefault();
        context.setNotes([...context.notes, note]);
    }
    return (
    <form onSubmit={create}>
        <input id="id" placeholder="id" value={note.id} onChange={handleForm}  />
        <textarea id="note" placeholder="Note" value={note.note} onChange={handleForm} />
        <button type="submit">Create</button>
    </form>
    );
}