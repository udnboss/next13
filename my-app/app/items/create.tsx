import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ClientUtil } from "../../util";
import { IItem } from "../classes";



export function CreateItem({disabled, onSubmit}) {
    const [item, setItem] = useState<IItem>({ id: '', name: '' } as IItem);

    const handleForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setItem({
            ...item,
            [e.currentTarget.id]: e.currentTarget.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(item);        
    }

    return (!disabled &&
        <Form onSubmit={handleSubmit}>
            <Form.Control type="text" id="id" placeholder="id" value={item.id} onChange={handleForm} />
            <Form.Control type="text" id="name" placeholder="name" value={item.name} onChange={handleForm} />
            <Button type="submit">Create</Button>
        </Form>
    );
}