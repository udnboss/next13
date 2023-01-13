'use client';

import { useState, useContext } from "react";
import { NotesContext } from "../NotesContext";

export default function CreateNote({onCreate}) {
    const [id, setId] = useState('')
    const [note, setNote] = useState('')

    const notesContext = useContext(NotesContext);

    const create = (e) => {
        e.preventDefault();
        notesContext.setNotes([...notesContext.notes, {id: id, note: note}]);
    }
    return (
    <form onSubmit={create}>
        <input placeholder="id" value={note.id} onChange={(e) => setId(e.target.value)} />
        <textarea placeholder="Note" value={note.note} onChange={(e) => setNote(e.target.value)} />
        <button type="submit">Create</button>
    </form>
    );
}