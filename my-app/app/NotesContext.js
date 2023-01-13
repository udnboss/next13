'use client';

import { createContext, useContext, useState } from "react";

export const NotesContext = createContext();

export function NotesProvider({children}) {
    const [notes, setNotes] = useState([
            {'id': 1, 'note': 'sample note 1'},
            {'id': 2, 'note': 'sample note 2'}
        ])
    
        return (
            <NotesContext.Provider value = {{notes, setNotes}}>
                {children}
            </NotesContext.Provider>
        )
}