'use client';

export interface INote {
    id: string;
    note: string;
}

type notesContextType = {
    notes: INote[];
    setNotes: (notes:INote[]) => void;
};

const notesContextDefaultValues: notesContextType = {
    notes: [],
    setNotes: () => {}
};

import { createContext, ReactNode, useContext, useState } from "react";

export const NotesContext = createContext<notesContextType>(notesContextDefaultValues);

type Props = {
    children: ReactNode;
};

// context consumer hook
export const useNotesContext = () => {
    // get the context
    const context = useContext(NotesContext);
  
    // if `undefined`, throw an error
    if (context === undefined) {
      throw new Error("useNotesContext was used outside of its Provider");
    }
  
    return context;
  };

export function NotesProvider({children}: Props) {
    const [notes, setNotes] = useState<INote[]>([
          { id: '1', note: 'sample note 1'} as INote,
          { id: '2', note: 'sample note 2'} as INote
        ]);
    
    return (
        <NotesContext.Provider value = {{notes, setNotes}}>
            {children}
        </NotesContext.Provider>
    )
}