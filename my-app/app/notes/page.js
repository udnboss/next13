'use client';
import { useState } from "react";
import CreateNote from "./CreateNote";
import { NotesContext, NotesProvider } from "../NotesContext";

export default function NotesPage(){
    const [notes, setNotes] = useState([
        {'id': 1, 'note': 'sample note 1'},
        {'id': 2, 'note': 'sample note 2'},
        {'id': 3, 'note': 'sample note 3'},
    ])

    return (
        <>
        <NotesContext.Provider value = {{notes, setNotes}}>
            <NotesContext.Consumer>
            { context => (
                <>
                <div>
                    <h2>Notes Page</h2>
                    {context.notes.map(note => {
                        return <Note key={note.id} thenote={note} />;
                    })}
                </div>   
                <CreateNote></CreateNote> 
                </>
            )}

            </NotesContext.Consumer>
        </NotesContext.Provider>
        </>
    )
}

function Note({thenote}){
    const {id, note} = thenote || {};

    return (
        <a href={`/notes/${id}`}>
            <p>{note}</p>
        </a>
    )
}